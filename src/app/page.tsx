"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuction } from "@/context/AuctionContext";
import { formatINR, formatCompactINR } from "@/lib/formatters";
import { ProductCard } from "@/components/products/ProductCard";
import { BidModal } from "@/components/auctions/BidModal";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import { Product } from "@/types";
import {
  Zap,
  Flame,
  TrendingUp,
  ArrowRight,
  Gavel,
  Compass,
  BarChart3,
  Activity,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { getCategoryPriceTrends } from "@/data/analytics";

export default function HomePage() {
  const { products, metrics } = useAuction();
  const [selectedProductForBid, setSelectedProductForBid] = useState<Product | null>(null);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const marqueeAuction = products.find((p) => p.id === "gpu-rtx-4080-super") || products[0];

  const trendData = getCategoryPriceTrends("7d");

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-12 sm:pb-20 border-b border-[#29302A]/80 tech-grid">
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#C6FF00]/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151919] border border-[#29302A] text-xs font-mono text-[#C6FF00]">
                <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-pulse" />
                <span className="uppercase tracking-wider font-semibold">
                  LIVE HARDWARE AUCTIONS NOW ACTIVE
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F7F2] leading-[1.05]">
                PUSH THE LIMITS. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF00] via-[#9DFF3F] to-white">
                  OWN THE HARDWARE.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-[#9BA39B] max-w-2xl leading-relaxed font-sans">
                Discover computer hardware auctions, track real-time market prices,
                and compete for your next upgrade in an interactive competitive marketplace.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/arena"
                  className="px-8 py-4 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider rounded transition-all flex items-center gap-2.5 glow-lime cursor-pointer group"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>ENTER THE ARENA</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/analytics"
                  className="px-7 py-4 bg-[#151919] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#C6FF00] text-[#F5F7F2] font-mono text-sm uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4 text-[#C6FF00]" />
                  <span>EXPLORE MARKET DATA</span>
                </Link>
              </div>

              {/* Brand tagline badges */}
              <div className="pt-6 border-t border-[#29302A]/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-[#68716B]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#C6FF00]">✓</span>
                  <span>Bid Beyond Limits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#C6FF00]">✓</span>
                  <span>Every Component Has a Price</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#C6FF00]">✓</span>
                  <span>Simulated Demonstration Data</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-End Hardware Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-[#151919] border border-[#29302A] hover:border-[#C6FF00]/50 rounded-xl p-5 shadow-2xl transition-all glow-lime-sm">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#29302A]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185] animate-ping" />
                    <span className="text-xs font-mono font-bold text-[#F5F7F2] uppercase tracking-wider">
                      FEATURED ARENA ITEM
                    </span>
                  </div>
                  <CountdownBadge endTime={marqueeAuction.endTime} compact />
                </div>

                {/* Hardware Photo Preview */}
                <div className="relative mt-4 aspect-video w-full rounded-lg overflow-hidden bg-[#101313] border border-[#29302A]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={marqueeAuction.image}
                    alt={marqueeAuction.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A0A] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#9DFF3F] bg-[#080A0A]/90 px-2 py-0.5 rounded border border-[#29302A]">
                        {marqueeAuction.category}
                      </span>
                      <h3 className="text-sm font-bold font-heading text-[#F5F7F2] mt-1 line-clamp-1">
                        {marqueeAuction.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Live Bidding Data Bar */}
                <div className="mt-4 p-3 bg-[#101313] rounded border border-[#29302A] grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#9BA39B]">Current Highest Bid</div>
                    <div className="text-xl font-mono font-bold text-[#C6FF00] mt-0.5">
                      {formatINR(marqueeAuction.currentBid)}
                    </div>
                  </div>
                  <div className="border-l border-[#29302A] pl-3">
                    <div className="text-[10px] font-mono uppercase text-[#9BA39B]">Est. Market Value</div>
                    <div className="text-base font-mono text-[#F5F7F2] mt-0.5">
                      {formatINR(marqueeAuction.estimatedMarketValue)}
                    </div>
                  </div>
                </div>

                {/* Specs quick pill preview */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="p-1.5 bg-[#1B2020] rounded border border-[#29302A] text-[#9BA39B]">
                    16GB GDDR6X
                  </div>
                  <div className="p-1.5 bg-[#1B2020] rounded border border-[#29302A] text-[#9BA39B]">
                    Ada Lovelace
                  </div>
                  <div className="p-1.5 bg-[#1B2020] rounded border border-[#29302A] text-[#9BA39B]">
                    14 Bids Active
                  </div>
                </div>

                {/* Quick Action Button */}
                <button
                  onClick={() => setSelectedProductForBid(marqueeAuction)}
                  className="mt-4 w-full py-3 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gavel className="w-4 h-4" />
                  <span>Place Simulated Bid on this Hardware</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MARKET SNAPSHOT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#C6FF00] mb-1">
              Live Exchange Telemetry
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F7F2]">
              MARKET SNAPSHOT
            </h2>
          </div>
          <div className="text-xs font-mono text-[#68716B]">
            Aggregated in real-time from active simulated catalog
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="p-5 bg-[#151919] border border-[#29302A] rounded-lg relative overflow-hidden">
            <div className="text-xs font-mono uppercase text-[#9BA39B] flex items-center justify-between">
              <span>Active Auctions</span>
              <Activity className="w-4 h-4 text-[#C6FF00]" />
            </div>
            <div className="text-3xl font-mono font-bold text-[#F5F7F2] mt-2">
              {metrics.activeAuctions}
            </div>
            <div className="text-xs font-mono text-[#9DFF3F] mt-1 flex items-center gap-1">
              <span>Live hardware items in arena</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-5 bg-[#151919] border border-[#29302A] rounded-lg relative overflow-hidden">
            <div className="text-xs font-mono uppercase text-[#9BA39B] flex items-center justify-between">
              <span>Total Marketplace Value</span>
              <Sparkles className="w-4 h-4 text-[#FACC15]" />
            </div>
            <div className="text-3xl font-mono font-bold text-[#C6FF00] mt-2">
              {formatCompactINR(metrics.totalMarketValue)}
            </div>
            <div className="text-xs font-mono text-[#9BA39B] mt-1">
              Estimated catalog valuation
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-5 bg-[#151919] border border-[#29302A] rounded-lg relative overflow-hidden">
            <div className="text-xs font-mono uppercase text-[#9BA39B] flex items-center justify-between">
              <span>Average Bid Price</span>
              <TrendingUp className="w-4 h-4 text-[#4ADE80]" />
            </div>
            <div className="text-3xl font-mono font-bold text-[#F5F7F2] mt-2">
              {formatINR(metrics.averageWinningPrice)}
            </div>
            <div className="text-xs font-mono text-[#9BA39B] mt-1">
              Mean value across listings
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-5 bg-[#151919] border border-[#29302A] rounded-lg relative overflow-hidden">
            <div className="text-xs font-mono uppercase text-[#9BA39B] flex items-center justify-between">
              <span>Ending Soon</span>
              <Flame className="w-4 h-4 text-[#FB7185] animate-pulse" />
            </div>
            <div className="text-3xl font-mono font-bold text-[#FB7185] mt-2">
              {metrics.endingSoonCount} Listings
            </div>
            <div className="text-xs font-mono text-[#FB7185] mt-1">
              Under 3 hours remaining
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED AUCTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#C6FF00] mb-1">
              Premier Components
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F7F2]">
              FEATURED AUCTIONS
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-mono text-[#C6FF00] hover:text-[#9DFF3F] uppercase tracking-wider flex items-center gap-1 group"
          >
            <span>View all {products.length} hardware items</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenBid={(p) => setSelectedProductForBid(p)}
            />
          ))}
        </div>
      </section>

      {/* SECTION 4: ENTER THE ARENA PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#151919] border border-[#29302A] rounded-xl p-6 sm:p-10 lg:p-12 overflow-hidden">
          {/* Subtle cyber background line */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(#C6FF00_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#101313] border border-[#29302A] text-xs font-mono text-[#FACC15]">
                <Flame className="w-3.5 h-3.5" />
                <span>OVERCLOCK ARENA SPOTLIGHT</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F5F7F2] tracking-tight">
                THE CLOCK IS TICKING.
              </h2>
              <p className="text-sm sm:text-base text-[#9BA39B] max-w-xl leading-relaxed">
                Find the components you want. Watch the competition. Make your move
                before time runs out. In the Overclock Arena, every second counts and
                every bid changes the leaderboard.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/arena"
                  className="px-6 py-3.5 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-2 glow-lime cursor-pointer"
                >
                  <Gavel className="w-4 h-4" />
                  <span>Enter the Arena</span>
                </Link>
                <div className="text-xs font-mono text-[#9BA39B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                  <span>Real-time per-second timer synchronization</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#101313] p-5 rounded-lg border border-[#29302A] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#9BA39B]">
                <span>FAST-PACED LISTING</span>
                <span className="text-[#C6FF00] font-bold">19m REMAINING</span>
              </div>
              <div className="text-sm font-bold font-heading text-[#F5F7F2]">
                AMD Ryzen 7 7800X3D Gaming Processor
              </div>
              <div className="flex items-center justify-between py-2 border-y border-[#29302A] font-mono">
                <span className="text-xs text-[#9BA39B]">Current Bid:</span>
                <span className="text-lg font-bold text-[#C6FF00]">₹34,500</span>
              </div>
              <CountdownBadge endTime={products[1]?.endTime || "2026-10-30T18:00:00.000Z"} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: MARKET INTELLIGENCE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#C6FF00] mb-1">
              Data Visualization Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F7F2]">
              MARKET INTELLIGENCE PREVIEW
            </h2>
          </div>
          <Link
            href="/analytics"
            className="text-xs font-mono text-[#C6FF00] hover:text-[#9DFF3F] uppercase tracking-wider flex items-center gap-1 group"
          >
            <span>Launch Complete Analytics Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="bg-[#151919] border border-[#29302A] rounded-xl p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#29302A]">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#F5F7F2]">
                Hardware Price Trends (7-Day Sample Observation)
              </h3>
              <p className="text-xs font-mono text-[#9BA39B] mt-0.5">
                Observed price movements in INR across key component categories
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-1 bg-[#101313] border border-[#29302A] rounded text-[#9DFF3F]">
                SIMULATED MARKET DATA
              </span>
            </div>
          </div>

          {/* Recharts Line Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#29302A" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#9BA39B"
                  tick={{ fill: "#9BA39B", fontSize: 12, fontFamily: "monospace" }}
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
                  formatter={(val: unknown) => [formatINR(Number(val) || 0)]}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "12px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Graphics Cards"
                  stroke="#C6FF00"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#C6FF00" }}
                />
                <Line
                  type="monotone"
                  dataKey="Processors"
                  stroke="#9DFF3F"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#9DFF3F" }}
                />
                <Line
                  type="monotone"
                  dataKey="Storage"
                  stroke="#FACC15"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#FACC15" }}
                />
                <Line
                  type="monotone"
                  dataKey="Memory"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#60A5FA" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SECTION 6: HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-[#C6FF00] mb-1">
            Seamless Workflow
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-[#F5F7F2]">
            HOW IT WORKS
          </h2>
          <p className="text-xs sm:text-sm font-mono text-[#9BA39B] mt-2">
            Three core steps to navigate the Overclock hardware bidding arena.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-[#151919] border border-[#29302A] p-6 sm:p-8 rounded-lg relative">
            <div className="text-4xl font-mono font-extrabold text-[#29302A] mb-4">
              01
            </div>
            <div className="w-10 h-10 rounded bg-[#101313] border border-[#29302A] flex items-center justify-center text-[#C6FF00] mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#F5F7F2] mb-2">
              1. EXPLORE
            </h3>
            <p className="text-xs sm:text-sm text-[#9BA39B] leading-relaxed">
              Discover high-demand components, filter by architecture, condition, and
              price ranges. Compare current bids with estimated market valuations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#151919] border border-[#29302A] p-6 sm:p-8 rounded-lg relative">
            <div className="text-4xl font-mono font-extrabold text-[#29302A] mb-4">
              02
            </div>
            <div className="w-10 h-10 rounded bg-[#101313] border border-[#29302A] flex items-center justify-center text-[#9DFF3F] mb-4">
              <Gavel className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#F5F7F2] mb-2">
              2. COMPETE
            </h3>
            <p className="text-xs sm:text-sm text-[#9BA39B] leading-relaxed">
              Enter the Overclock Arena. Place simulated bids, watch live countdown
              clocks down to the final second, and outmaneuver other simulated buyers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#151919] border border-[#29302A] p-6 sm:p-8 rounded-lg relative">
            <div className="text-4xl font-mono font-extrabold text-[#29302A] mb-4">
              03
            </div>
            <div className="w-10 h-10 rounded bg-[#101313] border border-[#29302A] flex items-center justify-center text-[#FACC15] mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#F5F7F2] mb-2">
              3. ANALYZE
            </h3>
            <p className="text-xs sm:text-sm text-[#9BA39B] leading-relaxed">
              Study price trends, category competition levels, and bid distributions
              in the dedicated Market Intelligence suite to time your bids.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#151919] to-[#101313] border border-[#29302A] rounded-xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101313] border border-[#29302A] text-xs font-mono text-[#C6FF00]">
            <Zap className="w-3.5 h-3.5" />
            <span>BID BEYOND LIMITS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F5F7F2] max-w-2xl mx-auto tracking-tight">
            YOUR NEXT UPGRADE STARTS HERE.
          </h2>

          <p className="text-sm sm:text-base text-[#9BA39B] max-w-lg mx-auto leading-relaxed">
            Join the simulated hardware bidding floor today. Test your bidding strategy
            against realistic market dynamics.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/explore"
              className="px-8 py-3.5 bg-[#151919] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#C6FF00] text-[#F5F7F2] font-mono text-xs sm:text-sm uppercase tracking-wider rounded transition-colors"
            >
              Explore Hardware
            </Link>
            <Link
              href="/arena"
              className="px-8 py-3.5 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs sm:text-sm uppercase tracking-wider rounded transition-all glow-lime flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              <span>Enter the Arena</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Bid Modal */}
      <BidModal
        product={selectedProductForBid}
        isOpen={Boolean(selectedProductForBid)}
        onClose={() => setSelectedProductForBid(null)}
      />
    </div>
  );
}
