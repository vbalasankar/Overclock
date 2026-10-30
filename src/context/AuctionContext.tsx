"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, Bid, MarketMetrics } from "@/types";
import { INITIAL_PRODUCTS } from "@/data/products";

interface PlaceBidResult {
  success: boolean;
  message: string;
}

interface AuctionContextType {
  products: Product[];
  watchlist: string[];
  userBids: { productId: string; amount: number; timestamp: string }[];
  isHydrated: boolean;
  toggleWatchlist: (productId: string) => void;
  isInWatchlist: (productId: string) => boolean;
  clearWatchlist: () => void;
  placeBid: (productId: string, amount: number, bidderName?: string) => PlaceBidResult;
  getProduct: (id: string) => Product | undefined;
  metrics: MarketMetrics;
  resetAllData: () => void;
}

const AuctionContext = createContext<AuctionContextType | null>(null);

const STORAGE_KEY_PRODUCTS = "overclock_products_v1";
const STORAGE_KEY_WATCHLIST = "overclock_watchlist_v1";
const STORAGE_KEY_USER_BIDS = "overclock_user_bids_v1";

const STATIC_BASE_MS = new Date("2026-10-30T16:00:00.000Z").getTime();

function computeMetrics(products: Product[], nowMs: number): MarketMetrics {
  const activeProducts = products.filter((p) => {
    const isPast = new Date(p.endTime).getTime() <= nowMs;
    return p.status === "active" && !isPast;
  });

  const activeAuctions = activeProducts.length;
  const totalMarketValue = activeProducts.reduce(
    (acc, p) => acc + p.estimatedMarketValue,
    0
  );

  const totalCurrentBids = activeProducts.reduce((acc, p) => acc + p.currentBid, 0);
  const averageWinningPrice =
    activeAuctions > 0 ? Math.round(totalCurrentBids / activeAuctions) : 0;

  const endingSoonCount = activeProducts.filter((p) => {
    const remainingSec = Math.floor(
      (new Date(p.endTime).getTime() - nowMs) / 1000
    );
    return remainingSec > 0 && remainingSec <= 3 * 3600;
  }).length;

  const totalSimulatedBids = products.reduce((acc, p) => acc + p.bidCount, 0);

  const avgBidToValueRatio =
    activeAuctions > 0
      ? Number(
          (
            activeProducts.reduce(
              (acc, p) => acc + (p.currentBid / p.estimatedMarketValue) * 100,
              0
            ) / activeAuctions
          ).toFixed(1)
        )
      : 88.5;

  const catBids: Record<string, { bids: number; count: number }> = {};
  activeProducts.forEach((p) => {
    if (!catBids[p.category]) catBids[p.category] = { bids: 0, count: 0 };
    catBids[p.category].bids += p.bidCount;
    catBids[p.category].count += 1;
  });

  let mostComp = "Graphics Cards";
  let maxAvg = 0;
  Object.entries(catBids).forEach(([cat, data]) => {
    const avg = data.bids / data.count;
    if (avg > maxAvg) {
      maxAvg = avg;
      mostComp = cat;
    }
  });

  return {
    activeAuctions,
    totalMarketValue,
    averageWinningPrice,
    endingSoonCount,
    totalSimulatedBids,
    avgBidToValueRatio,
    mostCompetitiveCategory: mostComp,
  };
}

export function AuctionProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [userBids, setUserBids] = useState<{ productId: string; amount: number; timestamp: string }[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [metrics, setMetrics] = useState<MarketMetrics>(() =>
    computeMetrics(INITIAL_PRODUCTS, STATIC_BASE_MS)
  );

  // Initialize from LocalStorage safely on client mount
  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem(STORAGE_KEY_WATCHLIST);
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }

      const storedUserBids = localStorage.getItem(STORAGE_KEY_USER_BIDS);
      if (storedUserBids) {
        setUserBids(JSON.parse(storedUserBids));
      }

      const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (storedProducts) {
        const parsed: Product[] = JSON.parse(storedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setMetrics(computeMetrics(parsed, Date.now()));
          setIsHydrated(true);
          return;
        }
      }

      // If no stored products, ensure initial endTimes are active relative to client Date.now()
      const clientNow = Date.now();
      const dynamicInitial = INITIAL_PRODUCTS.map((p) => {
        if (p.status === "ended") return p;
        // Keep offset from static base
        const originalEnd = new Date(p.endTime).getTime();
        const offset = originalEnd - STATIC_BASE_MS;
        return {
          ...p,
          endTime: new Date(clientNow + offset).toISOString(),
        };
      });
      setProducts(dynamicInitial);
      setMetrics(computeMetrics(dynamicInitial, clientNow));
    } catch (e) {
      console.warn("Could not load Overclock data from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Update metrics whenever products change or on client timer
  useEffect(() => {
    if (!isHydrated) return;
    setMetrics(computeMetrics(products, Date.now()));

    const interval = setInterval(() => {
      setMetrics(computeMetrics(products, Date.now()));
    }, 5000);

    return () => clearInterval(interval);
  }, [products, isHydrated]);

  // Save to LocalStorage when changed (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save products to localStorage:", e);
    }
  }, [products, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
    } catch (e) {
      console.error("Failed to save watchlist to localStorage:", e);
    }
  }, [watchlist, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_USER_BIDS, JSON.stringify(userBids));
    } catch (e) {
      console.error("Failed to save user bids to localStorage:", e);
    }
  }, [userBids, isHydrated]);

  // Watchlist Actions
  const toggleWatchlist = (productId: string) => {
    setWatchlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isInWatchlist = (productId: string) => {
    return watchlist.includes(productId);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  // Place Bid Action with strict validation
  const placeBid = (
    productId: string,
    amount: number,
    bidderName: string = "You (Pilot)"
  ): PlaceBidResult => {
    const target = products.find((p) => p.id === productId);

    if (!target) {
      return { success: false, message: "Listing not found." };
    }

    if (target.status === "ended") {
      return { success: false, message: "Auction has already ended." };
    }

    const endMs = new Date(target.endTime).getTime();
    if (endMs <= Date.now()) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: "ended" } : p))
      );
      return { success: false, message: "Auction just ended. Bids no longer accepted." };
    }

    const minAllowed = target.currentBid + target.minimumBidIncrement;
    if (isNaN(amount) || amount <= 0) {
      return { success: false, message: "Please enter a valid bid amount." };
    }

    if (amount < minAllowed) {
      return {
        success: false,
        message: `Bid must be at least ₹${minAllowed.toLocaleString("en-IN")} (current bid + min increment).`,
      };
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bidderName,
      amount,
      timestamp: new Date().toISOString(),
      isDemo: false,
      isUserBid: true,
    };

    const newPricePoint = {
      date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
        new Date()
      ),
      price: amount,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            currentBid: amount,
            bidCount: p.bidCount + 1,
            bids: [newBid, ...p.bids],
            priceHistory: [...p.priceHistory, newPricePoint],
          };
        }
        return p;
      })
    );

    setUserBids((prev) => [
      { productId, amount, timestamp: new Date().toISOString() },
      ...prev,
    ]);

    return {
      success: true,
      message: `Success! Your simulated bid of ₹${amount.toLocaleString("en-IN")} was placed.`,
    };
  };

  const getProduct = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_WATCHLIST);
    localStorage.removeItem(STORAGE_KEY_USER_BIDS);
    setProducts(INITIAL_PRODUCTS);
    setWatchlist([]);
    setUserBids([]);
    setMetrics(computeMetrics(INITIAL_PRODUCTS, STATIC_BASE_MS));
  };

  return (
    <AuctionContext.Provider
      value={{
        products,
        watchlist,
        userBids,
        isHydrated,
        toggleWatchlist,
        isInWatchlist,
        clearWatchlist,
        placeBid,
        getProduct,
        metrics,
        resetAllData,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
}

export function useAuction() {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error("useAuction must be used within an AuctionProvider");
  }
  return context;
}
