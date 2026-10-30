"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatINR } from "@/lib/formatters";
import { useAuction } from "@/context/AuctionContext";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import {
  Heart,
  TrendingDown,
  TrendingUp,
  Gavel,
  ExternalLink,
  Cpu,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  onOpenBid?: (product: Product) => void;
  viewMode?: "grid" | "list";
}

export function ProductCard({
  product,
  onOpenBid,
  viewMode = "grid",
}: ProductCardProps) {
  const { isInWatchlist, toggleWatchlist } = useAuction();
  const [imageError, setImageError] = useState(false);
  const isWatched = isInWatchlist(product.id);

  const diffFromMarket = product.currentBid - product.estimatedMarketValue;
  const diffPercent = Math.round(
    ((product.currentBid - product.estimatedMarketValue) /
      product.estimatedMarketValue) *
      100
  );
  const isBelowMarket = diffFromMarket < 0;

  // Condition Badge colors
  const conditionColors: Record<string, string> = {
    New: "text-[#4ADE80] border-[#4ADE80]/30 bg-[#4ADE80]/10",
    "Like New": "text-[#9DFF3F] border-[#9DFF3F]/30 bg-[#9DFF3F]/10",
    Used: "text-[#FACC15] border-[#FACC15]/30 bg-[#FACC15]/10",
    Refurbished: "text-[#60A5FA] border-[#60A5FA]/30 bg-[#60A5FA]/10",
  };

  if (viewMode === "list") {
    return (
      <div className="group relative bg-[#151919] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#C6FF00]/40 rounded-lg p-4 transition-all flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Thumbnail & basic info */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link
            href={`/product/${product.id}`}
            className="relative w-20 h-20 md:w-24 md:h-24 bg-[#101313] rounded border border-[#29302A] overflow-hidden shrink-0 flex items-center justify-center"
          >
            {!imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#68716B] p-2 text-center">
                <Cpu className="w-6 h-6 text-[#C6FF00] mb-1" />
                <span className="text-[9px] font-mono leading-tight">HARDWARE</span>
              </div>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9BA39B] bg-[#101313] px-2 py-0.5 rounded border border-[#29302A]">
                {product.category}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  conditionColors[product.condition] || "text-[#9BA39B]"
                }`}
              >
                {product.condition}
              </span>
              <CountdownBadge endTime={product.endTime} compact />
            </div>

            <Link
              href={`/product/${product.id}`}
              className="text-sm md:text-base font-bold font-heading text-[#F5F7F2] hover:text-[#C6FF00] line-clamp-1 transition-colors"
            >
              {product.name}
            </Link>

            <div className="text-xs text-[#9BA39B] font-mono mt-0.5 flex items-center gap-3">
              <span>{product.bidCount} bids placed</span>
              <span>•</span>
              <span>{product.watcherCount} watching</span>
            </div>
          </div>
        </div>

        {/* Right: Pricing & CTA */}
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#29302A]">
          <div className="text-left md:text-right">
            <div className="text-[10px] text-[#9BA39B] font-mono uppercase">Current Bid</div>
            <div className="text-lg md:text-xl font-bold font-mono text-[#C6FF00]">
              {formatINR(product.currentBid)}
            </div>
            <div className="text-[11px] font-mono flex items-center gap-1 md:justify-end">
              {isBelowMarket ? (
                <span className="text-[#4ADE80] flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" />
                  {Math.abs(diffPercent)}% below market
                </span>
              ) : (
                <span className="text-[#FACC15] flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +{diffPercent}% market value
                </span>
              )}
            </div>
          </div>

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
              <Heart className={`w-4 h-4 ${isWatched ? "fill-[#C6FF00]" : ""}`} />
            </button>

            {onOpenBid && product.status === "active" && (
              <button
                onClick={() => onOpenBid(product)}
                className="py-2 px-3.5 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer glow-lime-sm"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Bid</span>
              </button>
            )}

            <Link
              href={`/product/${product.id}`}
              className="py-2 px-3 bg-[#101313] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#C6FF00] text-[#F5F7F2] text-xs font-mono rounded transition-colors flex items-center gap-1"
            >
              <span>Details</span>
              <ExternalLink className="w-3 h-3 text-[#9BA39B]" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Mode
  return (
    <div className="group relative bg-[#151919] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#C6FF00]/50 rounded-lg overflow-hidden transition-all duration-200 flex flex-col justify-between hover:shadow-[0_4px_24px_-4px_rgba(198,255,0,0.15)]">
      {/* Top Media Area */}
      <div>
        <div className="relative aspect-video w-full bg-[#101313] overflow-hidden border-b border-[#29302A]">
          {!imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#68716B]">
              <Cpu className="w-10 h-10 text-[#C6FF00] mb-2" />
              <span className="text-xs font-mono">SPECIFIED HARDWARE</span>
            </div>
          )}

          {/* Floating Category & Condition Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F7F2] bg-[#080A0A]/85 backdrop-blur-md px-2 py-0.5 rounded border border-[#29302A]">
              {product.category}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border backdrop-blur-md ${
                conditionColors[product.condition] || "text-[#9BA39B] border-[#29302A] bg-[#080A0A]/80"
              }`}
            >
              {product.condition}
            </span>
          </div>

          {/* Floating Watchlist Button */}
          <button
            onClick={() => toggleWatchlist(product.id)}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isWatched
                ? "bg-[#C6FF00] text-[#080A0A] shadow-md"
                : "bg-[#080A0A]/80 text-[#9BA39B] hover:text-[#F5F7F2] border border-[#29302A]"
            }`}
            title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
            aria-label="Toggle watchlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWatched ? "fill-current" : ""}`} />
          </button>

          {/* Floating Live Countdown */}
          <div className="absolute bottom-3 left-3">
            <CountdownBadge endTime={product.endTime} compact />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-mono text-[#9BA39B] mb-1">
            <span>{product.manufacturer}</span>
            <span>{product.model}</span>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-heading font-bold text-base text-[#F5F7F2] group-hover:text-[#C6FF00] line-clamp-2 transition-colors min-h-[3rem]">
              {product.name}
            </h3>
          </Link>

          {/* Pricing Grid */}
          <div className="mt-4 pt-3 border-t border-[#29302A] grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] uppercase font-mono text-[#9BA39B]">Current Bid</div>
              <div className="text-lg font-mono font-bold text-[#C6FF00]">
                {formatINR(product.currentBid)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-[#9BA39B]">Est. Value</div>
              <div className="text-sm font-mono text-[#9BA39B]">
                {formatINR(product.estimatedMarketValue)}
              </div>
            </div>
          </div>

          {/* Market Comparison Indicator */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
            {isBelowMarket ? (
              <span className="text-[#4ADE80] flex items-center gap-1 bg-[#4ADE80]/10 px-2 py-0.5 rounded border border-[#4ADE80]/20">
                <TrendingDown className="w-3 h-3" />
                <span>{Math.abs(diffPercent)}% below market</span>
              </span>
            ) : (
              <span className="text-[#FACC15] flex items-center gap-1 bg-[#FACC15]/10 px-2 py-0.5 rounded border border-[#FACC15]/20">
                <TrendingUp className="w-3 h-3" />
                <span>+{diffPercent}% above est.</span>
              </span>
            )}
            <span className="text-[#68716B]">{product.bidCount} bids</span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
        {product.status === "active" ? (
          <>
            {onOpenBid && (
              <button
                onClick={() => onOpenBid(product)}
                className="flex-1 py-2.5 px-3 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer glow-lime-sm"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Place Bid</span>
              </button>
            )}
            <Link
              href={`/product/${product.id}`}
              className="py-2.5 px-3 bg-[#101313] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#C6FF00] text-[#F5F7F2] font-mono text-xs rounded transition-colors flex items-center justify-center gap-1"
            >
              <span>View</span>
            </Link>
          </>
        ) : (
          <div className="w-full py-2.5 text-center font-mono text-xs text-[#68716B] bg-[#101313] border border-[#29302A] rounded">
            Auction Closed · Sold
          </div>
        )}
      </div>
    </div>
  );
}
