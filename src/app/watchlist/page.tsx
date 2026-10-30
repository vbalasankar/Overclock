"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuction } from "@/context/AuctionContext";
import { ProductCard } from "@/components/products/ProductCard";
import { BidModal } from "@/components/auctions/BidModal";
import { Product } from "@/types";
import { Heart, Trash2, Compass } from "lucide-react";

export default function WatchlistPage() {
  const { products, watchlist, clearWatchlist } = useAuction();
  const [selectedProductForBid, setSelectedProductForBid] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<"endingSoon" | "lowestBid" | "highestBid">("endingSoon");

  const watchedProducts = useMemo(() => {
    return products.filter((p) => watchlist.includes(p.id));
  }, [products, watchlist]);

  const sortedProducts = useMemo(() => {
    const list = [...watchedProducts];
    switch (sortBy) {
      case "lowestBid":
        return list.sort((a, b) => a.currentBid - b.currentBid);
      case "highestBid":
        return list.sort((a, b) => b.currentBid - a.currentBid);
      case "endingSoon":
      default:
        return list.sort((a, b) => {
          const aTime = new Date(a.endTime).getTime();
          const bTime = new Date(b.endTime).getTime();
          return aTime - bTime;
        });
    }
  }, [watchedProducts, sortBy]);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to remove all saved hardware from your watchlist?")) {
      clearWatchlist();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#29302A] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#C6FF00] mb-1">
            Personal Radar
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F5F7F2] tracking-tight">
            YOUR WATCHLIST
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#9BA39B] mt-1.5">
            Keep an eye on the hardware worth competing for. Monitored in real time with local persistence.
          </p>
        </div>

        {watchedProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "endingSoon" | "lowestBid" | "highestBid")
              }
              className="px-3 py-2 bg-[#151919] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2] outline-none"
            >
              <option value="endingSoon">Sort: Ending Soon</option>
              <option value="lowestBid">Sort: Lowest Current Bid</option>
              <option value="highestBid">Sort: Highest Current Bid</option>
            </select>

            <button
              onClick={handleClear}
              className="px-3 py-2 bg-[#151919] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#FB7185] rounded text-xs font-mono text-[#9BA39B] hover:text-[#FB7185] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Watchlist</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content: List or Empty State */}
      {watchedProducts.length === 0 ? (
        <div className="bg-[#151919] border border-[#29302A] rounded-xl p-12 sm:p-16 text-center space-y-5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#101313] border border-[#29302A] flex items-center justify-center mx-auto text-[#68716B]">
            <Heart className="w-8 h-8 text-[#C6FF00]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F7F2]">
            NOTHING ON YOUR RADAR. YET.
          </h2>

          <p className="text-xs sm:text-sm font-mono text-[#9BA39B] leading-relaxed max-w-md mx-auto">
            Explore the marketplace and save components you want to keep track of.
            Click the heart icon on any hardware card to bookmark it here.
          </p>

          <div className="pt-2">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all glow-lime-sm cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>EXPLORE HARDWARE</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-mono text-[#9BA39B]">
            Tracking <strong className="text-[#C6FF00]">{watchedProducts.length}</strong> saved
            component{watchedProducts.length > 1 ? "s" : ""}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenBid={(p) => setSelectedProductForBid(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Interactive Bid Modal */}
      <BidModal
        product={selectedProductForBid}
        isOpen={Boolean(selectedProductForBid)}
        onClose={() => setSelectedProductForBid(null)}
      />
    </div>
  );
}
