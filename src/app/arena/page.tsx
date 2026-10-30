"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuction } from "@/context/AuctionContext";
import { formatINR, formatCompactINR } from "@/lib/formatters";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import { BidModal } from "@/components/auctions/BidModal";
import { Product } from "@/types";
import {
  Gavel,
  Flame,
  Activity,
  Trophy,
  Radio,
  Heart,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";

export default function ArenaPage() {
  const { products, metrics, isInWatchlist, toggleWatchlist, userBids } = useAuction();
  const [selectedProductForBid, setSelectedProductForBid] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "endingSoon" | "competitive" | "Graphics Cards" | "Processors" | "Memory" | "Storage"
  >("all");
  const [currentTime, setCurrentTime] = useState<number>(() =>
    new Date("2026-10-30T16:00:00.000Z").getTime()
  );

  React.useEffect(() => {
    setCurrentTime(Date.now());
  }, []);

  // Determine user leading status
  const userLeadingProductIds = useMemo(() => {
    return new Set(
      products
        .filter((p) => {
          if (!p.bids || p.bids.length === 0) return false;
          const topBid = p.bids[0];
          return topBid.isUserBid === true;
        })
        .map((p) => p.id)
    );
  }, [products]);

  // Tab filtering
  const arenaProducts = useMemo(() => {
    switch (activeTab) {
      case "endingSoon":
        return products.filter((p) => {
          const diff = Math.floor((new Date(p.endTime).getTime() - currentTime) / 1000);
          return diff > 0 && diff <= 3 * 3600;
        });
      case "competitive":
        return [...products].sort((a, b) => b.bidCount - a.bidCount);
      case "Graphics Cards":
      case "Processors":
      case "Memory":
      case "Storage":
        return products.filter((p) => p.category === activeTab);
      case "all":
      default:
        return products;
    }
  }, [products, activeTab, currentTime]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* ARENA HEADER BANNER */}
      <div className="relative bg-[#151919] border border-[#29302A] rounded-xl p-6 sm:p-8 overflow-hidden glow-lime-sm">
        {/* Subtle grid and electric scanline */}
        <div className="absolute top-0 right-0 w-full h-1 circuit-line" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#C6FF00]/5 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101313] border border-[#29302A] text-xs font-mono text-[#C6FF00]">
              <Radio className="w-3.5 h-3.5 text-[#C6FF00] animate-pulse" />
              <span>LIVE AUCTION FLOOR · SIMULATED ARENA</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F5F7F2] tracking-tight">
              OVERCLOCK ARENA
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#9BA39B] max-w-xl">
              Every second counts. Every bid changes the game. Compete with simulated
              participants in real time for premier PC hardware.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="px-4 py-3 bg-[#101313] border border-[#29302A] rounded-lg font-mono text-center">
              <div className="text-[10px] text-[#9BA39B] uppercase">Leading In</div>
              <div className="text-xl font-bold text-[#C6FF00]">
                {userLeadingProductIds.size}
              </div>
            </div>
            <div className="px-4 py-3 bg-[#101313] border border-[#29302A] rounded-lg font-mono text-center">
              <div className="text-[10px] text-[#9BA39B] uppercase">Your Total Bids</div>
              <div className="text-xl font-bold text-[#9DFF3F]">
                {userBids.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ARENA TELEMETRY STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#9BA39B] flex items-center justify-between">
            <span>Active Auctions</span>
            <Activity className="w-3.5 h-3.5 text-[#C6FF00]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#F5F7F2] mt-1">
            {metrics.activeAuctions}
          </div>
          <div className="text-[11px] font-mono text-[#68716B] mt-0.5">
            Accepting live bids
          </div>
        </div>

        <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#9BA39B] flex items-center justify-between">
            <span>Ending Soon</span>
            <Flame className="w-3.5 h-3.5 text-[#FB7185] animate-pulse" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#FB7185] mt-1">
            {metrics.endingSoonCount}
          </div>
          <div className="text-[11px] font-mono text-[#FB7185]/80 mt-0.5">
            &lt; 3 hours to hammer
          </div>
        </div>

        <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#9BA39B] flex items-center justify-between">
            <span>Simulated Bid Value</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#C6FF00] mt-1">
            {formatCompactINR(metrics.totalMarketValue)}
          </div>
          <div className="text-[11px] font-mono text-[#68716B] mt-0.5">
            Total committed volume
          </div>
        </div>

        <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#9BA39B] flex items-center justify-between">
            <span>Total Simulated Bids</span>
            <Trophy className="w-3.5 h-3.5 text-[#9DFF3F]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#9DFF3F] mt-1">
            {metrics.totalSimulatedBids}
          </div>
          <div className="text-[11px] font-mono text-[#68716B] mt-0.5">
            Placed across platform
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#29302A]">
        {[
          { id: "all", label: "All Arena Auctions" },
          { id: "endingSoon", label: "Ending Soon (Hot)" },
          { id: "competitive", label: "Most Competitive" },
          { id: "Graphics Cards", label: "Graphics Cards" },
          { id: "Processors", label: "Processors" },
          { id: "Memory", label: "Memory" },
          { id: "Storage", label: "Storage" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(
                tab.id as
                  | "all"
                  | "endingSoon"
                  | "competitive"
                  | "Graphics Cards"
                  | "Processors"
                  | "Memory"
                  | "Storage"
              )
            }
            className={`px-4 py-2 rounded font-mono text-xs whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#C6FF00] text-[#080A0A] font-bold shadow-[0_0_12px_-2px_rgba(198,255,0,0.4)]"
                : "bg-[#151919] text-[#9BA39B] hover:text-[#F5F7F2] hover:bg-[#1B2020] border border-[#29302A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ARENA AUCTIONS LISTING */}
      <div className="space-y-4">
        {arenaProducts.map((product) => {
          const isLeading = userLeadingProductIds.has(product.id);
          const isWatched = isInWatchlist(product.id);
          const minNextBid = product.currentBid + product.minimumBidIncrement;
          const diffPercent = Math.round(
            ((product.currentBid - product.estimatedMarketValue) /
              product.estimatedMarketValue) *
              100
          );
          const isBelowMarket = diffPercent < 0;

          return (
            <div
              key={product.id}
              className={`relative bg-[#151919] border rounded-lg p-4 sm:p-5 transition-all duration-200 hover:border-[#C6FF00]/60 ${
                isLeading
                  ? "border-[#C6FF00] shadow-[0_0_20px_-3px_rgba(198,255,0,0.2)] bg-gradient-to-r from-[#151919] via-[#1B2020] to-[#151919]"
                  : "border-[#29302A]"
              }`}
            >
              {/* Leading Indicator Ribbon */}
              {isLeading && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#C6FF00] text-[#080A0A] font-heading font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Trophy className="w-3 h-3 fill-current" />
                  <span>YOU ARE CURRENTLY LEADING</span>
                </div>
              )}

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Media and Hardware Details */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <Link
                    href={`/product/${product.id}`}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#101313] border border-[#29302A] rounded overflow-hidden shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101313] border border-[#29302A] text-[#9DFF3F]">
                        {product.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#9BA39B]">
                        {product.condition}
                      </span>
                      <span className="text-[10px] font-mono text-[#68716B]">
                        Seller: {product.sellerName}
                      </span>
                    </div>

                    <Link
                      href={`/product/${product.id}`}
                      className="block font-heading font-bold text-base sm:text-lg text-[#F5F7F2] hover:text-[#C6FF00] line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </Link>

                    <div className="text-xs font-mono text-[#9BA39B] flex items-center gap-3">
                      <span>Starting: {formatINR(product.startingBid)}</span>
                      <span>•</span>
                      <span>{product.bidCount} bids</span>
                      <span>•</span>
                      <span>{product.watcherCount} watching</span>
                    </div>
                  </div>
                </div>

                {/* Countdown and Live Prices */}
                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-[#29302A]">
                  {/* Countdown Timer */}
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] font-mono uppercase text-[#9BA39B] mb-1">
                      Time Remaining
                    </div>
                    <CountdownBadge endTime={product.endTime} />
                  </div>

                  {/* Pricing Telemetry */}
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] font-mono uppercase text-[#9BA39B]">
                      Current Highest Bid
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[#C6FF00]">
                      {formatINR(product.currentBid)}
                    </div>
                    <div className="text-[11px] font-mono flex items-center gap-1 lg:justify-end">
                      {isBelowMarket ? (
                        <span className="text-[#4ADE80] flex items-center gap-0.5">
                          <TrendingDown className="w-3 h-3" />
                          {Math.abs(diffPercent)}% below est.
                        </span>
                      ) : (
                        <span className="text-[#FACC15] flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          +{diffPercent}% est. value
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWatchlist(product.id)}
                      className={`p-2.5 rounded border transition-colors cursor-pointer ${
                        isWatched
                          ? "bg-[#C6FF00]/10 border-[#C6FF00] text-[#C6FF00]"
                          : "bg-[#101313] border-[#29302A] text-[#9BA39B] hover:text-[#F5F7F2]"
                      }`}
                      title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
                      aria-label="Toggle watchlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${isWatched ? "fill-[#C6FF00]" : ""}`}
                      />
                    </button>

                    {product.status === "active" ? (
                      <button
                        onClick={() => setSelectedProductForBid(product)}
                        className="py-2.5 px-5 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-2 glow-lime-sm cursor-pointer"
                      >
                        <Gavel className="w-4 h-4" />
                        <span>Place Bid (Min {formatINR(minNextBid)})</span>
                      </button>
                    ) : (
                      <span className="py-2.5 px-4 bg-[#101313] border border-[#29302A] text-[#68716B] font-mono text-xs rounded">
                        Auction Closed
                      </span>
                    )}

                    <Link
                      href={`/product/${product.id}`}
                      className="py-2.5 px-3 bg-[#101313] hover:bg-[#1B2020] border border-[#29302A] text-[#F5F7F2] font-mono text-xs rounded transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Bid Modal */}
      <BidModal
        product={selectedProductForBid}
        isOpen={Boolean(selectedProductForBid)}
        onClose={() => setSelectedProductForBid(null)}
      />
    </div>
  );
}
