"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuction } from "@/context/AuctionContext";
import { formatINR, formatDate } from "@/lib/formatters";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import { ProductCard } from "@/components/products/ProductCard";
import { BidModal } from "@/components/auctions/BidModal";
import { Product } from "@/types";
import {
  Heart,
  Gavel,
  Shield,
  Cpu,
  Clock,
  ChevronRight,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import confetti from "canvas-confetti";

interface ProductDetailClientProps {
  id: string;
}

export function ProductDetailClient({ id }: ProductDetailClientProps) {
  const { products, getProduct, isInWatchlist, toggleWatchlist, placeBid } = useAuction();

  const product = getProduct(id);

  // States
  const [selectedImage, setSelectedImage] = useState<string>(product?.image || "");
  const [customBidAmount, setCustomBidAmount] = useState<number>(
    product ? product.currentBid + product.minimumBidIncrement : 0
  );
  const [bidderAlias, setBidderAlias] = useState("Pilot");
  const [bidStatus, setBidStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // If product not found, render proper not-found state
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#151919] border border-[#29302A] flex items-center justify-center mx-auto text-[#FB7185]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F7F2]">
          Hardware Listing Not Found
        </h1>
        <p className="font-mono text-sm text-[#9BA39B] max-w-md mx-auto">
          The requested component ID &ldquo;{id}&rdquo; could not be located in the
          active marketplace database.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/explore"
            className="px-6 py-3 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all"
          >
            Explore Available Hardware
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-[#151919] border border-[#29302A] text-[#F5F7F2] font-mono text-xs uppercase tracking-wider rounded hover:bg-[#1B2020]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isWatched = isInWatchlist(product.id);
  const minNextBid = product.currentBid + product.minimumBidIncrement;
  const diffPercent = Math.round(
    ((product.currentBid - product.estimatedMarketValue) /
      product.estimatedMarketValue) *
      100
  );
  const isBelowMarket = diffPercent < 0;

  // Similar products in same category
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleQuickBid = (increment: number) => {
    setCustomBidAmount((prev) => Math.max(minNextBid, prev + increment));
    setBidStatus(null);
  };

  const handleInlineBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (customBidAmount < minNextBid) {
      setBidStatus({
        type: "error",
        text: `Bid must be at least ${formatINR(minNextBid)} (current bid + min increment).`,
      });
      return;
    }

    setIsSubmitting(true);
    setBidStatus(null);

    try {
      const res = placeBid(product.id, customBidAmount, bidderAlias || "Pilot");
      if (res.success) {
        setBidStatus({ type: "success", text: res.message });
        setCustomBidAmount(customBidAmount + product.minimumBidIncrement);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#C6FF00", "#9DFF3F", "#FFFFFF"],
          });
        } catch {
          // ignore
        }
      } else {
        setBidStatus({ type: "error", text: res.message });
      }
    } catch {
      setBidStatus({
        type: "error",
        text: "An error occurred while placing your bid.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#9BA39B]">
        <Link href="/" className="hover:text-[#F5F7F2]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#68716B]" />
        <Link href="/explore" className="hover:text-[#F5F7F2]">
          Explore
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#68716B]" />
        <Link
          href={`/explore?category=${encodeURIComponent(product.category)}`}
          className="hover:text-[#C6FF00]"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#68716B]" />
        <span className="text-[#F5F7F2] truncate max-w-[200px] sm:max-w-xs">
          {product.name}
        </span>
      </div>

      {/* TOP SECTION: Gallery & Auction Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-video w-full bg-[#151919] border border-[#29302A] rounded-xl overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-2.5 py-1 rounded bg-[#080A0A]/85 backdrop-blur-md text-[11px] font-mono text-[#C6FF00] border border-[#29302A]">
                {product.category}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#080A0A]/85 backdrop-blur-md text-[11px] font-mono text-[#F5F7F2] border border-[#29302A]">
                {product.condition}
              </span>
            </div>

            <button
              onClick={() => toggleWatchlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isWatched
                  ? "bg-[#C6FF00] text-[#080A0A] shadow-md"
                  : "bg-[#080A0A]/80 text-[#9BA39B] hover:text-[#F5F7F2] border border-[#29302A]"
              }`}
              title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
              aria-label="Toggle watchlist"
            >
              <Heart className={`w-5 h-5 ${isWatched ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                    (selectedImage || product.image) === img
                      ? "border-[#C6FF00] ring-2 ring-[#C6FF00]/30"
                      : "border-[#29302A] opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Seller / Verification Box */}
          <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#101313] border border-[#29302A] flex items-center justify-center text-[#C6FF00]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[#F5F7F2] font-bold">{product.sellerName}</div>
                <div className="text-[#9BA39B] flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#C6FF00]">★ {product.sellerRating} / 5.0</span>
                  <span>•</span>
                  <span>Verified Enthusiast Seller</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-[#68716B] text-right">
              ID: {product.id}
            </div>
          </div>
        </div>

        {/* Right Column: Information & Bidding Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-[#151919] border border-[#29302A] rounded-xl p-6 sm:p-7 space-y-6 glow-lime-sm">
          {/* Header */}
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#9BA39B] flex items-center justify-between">
              <span>{product.manufacturer}</span>
              <span>Model: {product.model}</span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F7F2] leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Countdown timer */}
          <div className="p-4 bg-[#101313] rounded-lg border border-[#29302A] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#9BA39B]">
              <Clock className="w-4 h-4 text-[#C6FF00]" />
              <span>Auction Ends In:</span>
            </div>
            <CountdownBadge endTime={product.endTime} />
          </div>

          {/* Pricing Box */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#101313] rounded-lg border border-[#29302A]">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#9BA39B]">
                Current Highest Bid
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[#C6FF00] mt-1">
                {formatINR(product.currentBid)}
              </div>
              <div className="text-xs font-mono text-[#9BA39B] mt-0.5">
                {product.bidCount} bids placed
              </div>
            </div>

            <div className="border-l border-[#29302A] pl-4">
              <div className="text-[10px] font-mono uppercase text-[#9BA39B]">
                Est. Market Value
              </div>
              <div className="text-lg sm:text-xl font-mono text-[#F5F7F2] mt-1">
                {formatINR(product.estimatedMarketValue)}
              </div>
              <div className="text-xs font-mono mt-0.5">
                {isBelowMarket ? (
                  <span className="text-[#4ADE80]">
                    {Math.abs(diffPercent)}% below estimated
                  </span>
                ) : (
                  <span className="text-[#FACC15]">
                    +{diffPercent}% above estimated
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Bidding Form */}
          {product.status === "active" ? (
            <form onSubmit={handleInlineBidSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#9BA39B] mb-1.5">
                  <label htmlFor="detail-bidder-name">Your Call-Sign / Alias</label>
                  <span className="text-[11px] text-[#C6FF00]">
                    Min Next: {formatINR(minNextBid)}
                  </span>
                </div>
                <input
                  id="detail-bidder-name"
                  type="text"
                  value={bidderAlias}
                  onChange={(e) => setBidderAlias(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101313] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2] outline-none focus:border-[#C6FF00]"
                  placeholder="Pilot alias"
                />
              </div>

              <div>
                <label
                  htmlFor="detail-bid-amount"
                  className="block text-xs font-mono uppercase text-[#9BA39B] mb-1.5"
                >
                  Place Your Bid (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-[#9BA39B]">
                    ₹
                  </span>
                  <input
                    id="detail-bid-amount"
                    type="number"
                    value={customBidAmount || ""}
                    min={minNextBid}
                    step={product.minimumBidIncrement}
                    onChange={(e) => {
                      setCustomBidAmount(Number(e.target.value));
                      setBidStatus(null);
                    }}
                    className="w-full pl-8 pr-3 py-2.5 bg-[#101313] border border-[#29302A] focus:border-[#C6FF00] rounded font-mono text-base font-bold text-[#F5F7F2] outline-none"
                  />
                </div>
              </div>

              {/* Quick Increments */}
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2500, 5000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => handleQuickBid(inc)}
                    className="py-1.5 bg-[#101313] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#C6FF00] rounded text-[11px] font-mono text-[#F5F7F2] text-center transition-colors"
                  >
                    +{formatINR(inc)}
                  </button>
                ))}
              </div>

              {bidStatus && (
                <div
                  className={`p-3 rounded text-xs font-mono flex items-center gap-2 ${
                    bidStatus.type === "success"
                      ? "bg-[#4ADE80]/10 border border-[#4ADE80]/40 text-[#4ADE80]"
                      : "bg-[#FB7185]/10 border border-[#FB7185]/40 text-[#FB7185]"
                  }`}
                >
                  {bidStatus.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{bidStatus.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#C6FF00] hover:bg-[#9DFF3F] disabled:opacity-50 text-[#080A0A] font-heading font-extrabold text-sm uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 glow-lime-sm cursor-pointer"
              >
                <Gavel className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Transmitting Bid..."
                    : `Confirm Bid of ${formatINR(customBidAmount)}`}
                </span>
              </button>
            </form>
          ) : (
            <div className="p-4 bg-[#101313] border border-[#29302A] rounded-lg text-center font-mono text-xs text-[#68716B]">
              This simulated auction has closed. Final winning bid:{" "}
              <strong className="text-[#F5F7F2]">{formatINR(product.currentBid)}</strong>
            </div>
          )}

          {/* Buy Now Option if available */}
          {product.buyNowPrice && product.status === "active" && (
            <div className="pt-3 border-t border-[#29302A] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[#9BA39B]">Instant Buy-Now Option:</span>
                <div className="text-base font-bold text-[#F5F7F2]">
                  {formatINR(product.buyNowPrice)}
                </div>
              </div>
              <button
                onClick={() =>
                  alert(
                    `Buy-Now Simulation: Instant acquisition confirmed for ${product.name} at ${formatINR(
                      product.buyNowPrice!
                    )} (Demonstration Only - No charge).`
                  )
                }
                className="py-2 px-4 bg-[#1B2020] hover:bg-[#29302A] border border-[#29302A] hover:border-[#C6FF00] text-[#F5F7F2] rounded transition-colors text-xs font-mono cursor-pointer"
              >
                Instant Buy (Demo)
              </button>
            </div>
          )}

          {/* Demo disclaimer */}
          <div className="text-[11px] font-mono text-[#68716B] text-center pt-2">
            Simulated demonstration auction. No real payments or financial obligations.
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Description, Specifications, and Historical Price Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Specs & Description (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Description */}
          <div className="bg-[#151919] border border-[#29302A] rounded-xl p-6 space-y-3">
            <h3 className="font-heading font-bold text-lg text-[#F5F7F2] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#C6FF00]" />
              <span>Component Overview</span>
            </h3>
            <p className="text-sm font-sans text-[#9BA39B] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Category-Specific Hardware Specifications */}
          <div className="bg-[#151919] border border-[#29302A] rounded-xl p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#F5F7F2]">
              Technical Specifications ({product.category})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="p-3 bg-[#101313] rounded border border-[#29302A] font-mono text-xs flex flex-col justify-center"
                >
                  <span className="text-[#9BA39B] uppercase text-[10px]">{key}</span>
                  <span className="text-[#F5F7F2] font-semibold mt-0.5">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Price Chart */}
          <div className="bg-[#151919] border border-[#29302A] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#F5F7F2]">
                  Price History Trend
                </h3>
                <p className="text-xs font-mono text-[#9BA39B] mt-0.5">
                  Observed marketplace bid increments over time
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101313] border border-[#29302A] text-[#9DFF3F]">
                SIMULATED DATA
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={product.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#29302A" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9BA39B"
                    tick={{ fill: "#9BA39B", fontSize: 11, fontFamily: "monospace" }}
                  />
                  <YAxis
                    stroke="#9BA39B"
                    tick={{ fill: "#9BA39B", fontSize: 11, fontFamily: "monospace" }}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#101313",
                      borderColor: "#29302A",
                      borderRadius: "6px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                    }}
                    formatter={(val: unknown) => [formatINR(Number(val) || 0), "Price"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#C6FF00"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#C6FF00" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Bid History Log (5 Cols) */}
        <div className="lg:col-span-5 bg-[#151919] border border-[#29302A] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#29302A]">
            <h3 className="font-heading font-bold text-lg text-[#F5F7F2] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#C6FF00]" />
              <span>Bid Activity Log</span>
            </h3>
            <span className="text-xs font-mono text-[#9BA39B]">
              {product.bids.length} records
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {product.bids.map((bid, index) => {
              const isHighest = index === 0;
              return (
                <div
                  key={bid.id}
                  className={`p-3 rounded-lg border font-mono text-xs flex items-center justify-between transition-colors ${
                    isHighest
                      ? "bg-[#101313] border-[#C6FF00] shadow-[0_0_12px_-3px_rgba(198,255,0,0.25)]"
                      : "bg-[#101313]/60 border-[#29302A]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F5F7F2]">{bid.bidderName}</span>
                      {isHighest && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#C6FF00] text-[#080A0A] uppercase">
                          Highest Bid
                        </span>
                      )}
                      {bid.isUserBid && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#9DFF3F]/20 text-[#9DFF3F] border border-[#9DFF3F]/40 uppercase">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#68716B] mt-0.5">
                      {formatDate(bid.timestamp)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-bold text-sm ${
                        isHighest ? "text-[#C6FF00]" : "text-[#F5F7F2]"
                      }`}
                    >
                      {formatINR(bid.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Similar Hardware Listings */}
      {similarProducts.length > 0 && (
        <div className="pt-8 border-t border-[#29302A] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-xl text-[#F5F7F2]">
                Similar {product.category}
              </h3>
              <p className="text-xs font-mono text-[#9BA39B] mt-0.5">
                Explore alternative listings currently live in this hardware category
              </p>
            </div>
            <Link
              href={`/explore?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-mono text-[#C6FF00] hover:underline"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenBid={(item) => setModalProduct(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bid Modal for similar products */}
      <BidModal
        product={modalProduct}
        isOpen={Boolean(modalProduct)}
        onClose={() => setModalProduct(null)}
      />
    </div>
  );
}
