"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuction } from "@/context/AuctionContext";
import { formatINR } from "@/lib/formatters";
import { ProductCategory } from "@/types";
import { CATEGORIES, MANUFACTURERS } from "@/data/products";
import {
  filterProductsForAnalytics,
  getCategoryPriceTrends,
  getAuctionActivityData,
  getCategoryDistribution,
  getBidVsMarketValue,
  getCompetitiveCategories,
  getBidDistribution,
  generateAnalyticalInsights,
} from "@/data/analytics";
import {
  Activity,
  Search,
  ArrowUpDown,
  Lightbulb,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AnalyticsPage() {
  const { products } = useAuction();

  // Filters State
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All">("All");
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<"active" | "ended" | "All">("All");

  // Table Search and Sorting
  const [tableSearch, setTableSearch] = useState("");
  const [tableSortColumn, setTableSortColumn] = useState<
    "name" | "currentBid" | "estimatedMarketValue" | "bidCount" | "percentOfValue"
  >("currentBid");
  const [tableSortAsc, setTableSortAsc] = useState(false);

  // Filtered dataset for analytics
  const filteredProducts = useMemo(() => {
    return filterProductsForAnalytics(products, {
      dateRange,
      category: selectedCategory,
      manufacturer: selectedManufacturer,
      status: selectedStatus,
    });
  }, [products, dateRange, selectedCategory, selectedManufacturer, selectedStatus]);

  // Derived KPIs
  const totalListings = filteredProducts.length;
  const totalSimulatedBids = filteredProducts.reduce((acc, p) => acc + p.bidCount, 0);
  const totalValue = filteredProducts.reduce((acc, p) => acc + p.currentBid, 0);
  const avgBid = totalListings > 0 ? Math.round(totalValue / totalListings) : 0;

  const avgBidToValueRatio =
    totalListings > 0
      ? Number(
          (
            filteredProducts.reduce(
              (acc, p) => acc + (p.currentBid / p.estimatedMarketValue) * 100,
              0
            ) / totalListings
          ).toFixed(1)
        )
      : 0;

  const compCats = getCompetitiveCategories(filteredProducts);
  const mostCompCategory = compCats.length > 0 ? compCats[0].category : "N/A";

  // Data for Charts
  const priceTrendData = getCategoryPriceTrends(dateRange);
  const activityData = getAuctionActivityData(dateRange);
  const categoryDistributionData = getCategoryDistribution(filteredProducts);
  const bidVsMarketData = getBidVsMarketValue(filteredProducts);
  const competitiveData = getCompetitiveCategories(filteredProducts);
  const bidDistributionData = getBidDistribution(filteredProducts);
  const insights = generateAnalyticalInsights(filteredProducts);

  // Table filter and sort
  const tableProducts = useMemo(() => {
    return filteredProducts
      .filter((p) => {
        if (!tableSearch.trim()) return true;
        const q = tableSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;
        if (tableSortColumn === "name") {
          valA = a.name;
          valB = b.name;
          return tableSortAsc
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        } else if (tableSortColumn === "currentBid") {
          valA = a.currentBid;
          valB = b.currentBid;
        } else if (tableSortColumn === "estimatedMarketValue") {
          valA = a.estimatedMarketValue;
          valB = b.estimatedMarketValue;
        } else if (tableSortColumn === "bidCount") {
          valA = a.bidCount;
          valB = b.bidCount;
        } else if (tableSortColumn === "percentOfValue") {
          valA = (a.currentBid / a.estimatedMarketValue) * 100;
          valB = (b.currentBid / b.estimatedMarketValue) * 100;
        }
        return tableSortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [filteredProducts, tableSearch, tableSortColumn, tableSortAsc]);

  const toggleSort = (
    col: "name" | "currentBid" | "estimatedMarketValue" | "bidCount" | "percentOfValue"
  ) => {
    if (tableSortColumn === col) {
      setTableSortAsc(!tableSortAsc);
    } else {
      setTableSortColumn(col);
      setTableSortAsc(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* HEADER */}
      <div className="relative bg-[#151919] border border-[#29302A] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#101313] border border-[#29302A] text-xs font-mono text-[#C6FF00]">
            <Activity className="w-3.5 h-3.5" />
            <span>DEMO DATA · SIMULATED MARKET INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F5F7F2] tracking-tight">
            MARKET INTELLIGENCE
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#9BA39B] max-w-xl">
            Understand hardware pricing dynamics, auction competition velocity, and
            category-level demand through interactive data telemetry.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-[#101313] p-2 rounded-lg border border-[#29302A]">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1">
            {(["7d", "30d", "90d", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors uppercase cursor-pointer ${
                  dateRange === range
                    ? "bg-[#C6FF00] text-[#080A0A] font-bold"
                    : "text-[#9BA39B] hover:text-[#F5F7F2] hover:bg-[#1B2020]"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#29302A] mx-1 hidden sm:block" />

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as ProductCategory | "All")
            }
            className="px-2.5 py-1 bg-[#151919] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2] outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Manufacturer Dropdown */}
          <select
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            className="px-2.5 py-1 bg-[#151919] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2] outline-none"
          >
            <option value="All">All Brands</option>
            {MANUFACTURERS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as "active" | "ended" | "All")
            }
            className="px-2.5 py-1 bg-[#151919] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2] outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="ended">Ended Only</option>
          </select>
        </div>
      </div>

      {/* 6 KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#9BA39B]">Total Listings</div>
          <div className="text-2xl font-mono font-bold text-[#F5F7F2] mt-1">
            {totalListings}
          </div>
          <div className="text-[10px] font-mono text-[#68716B] mt-0.5">
            Active and concluded
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#9BA39B]">Average Current Bid</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#C6FF00] mt-1">
            {formatINR(avgBid)}
          </div>
          <div className="text-[10px] font-mono text-[#68716B] mt-0.5">
            Mean hammer/active price
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#9BA39B]">Bid-to-Value Ratio</div>
          <div className="text-2xl font-mono font-bold text-[#9DFF3F] mt-1">
            {avgBidToValueRatio}%
          </div>
          <div className="text-[10px] font-mono text-[#68716B] mt-0.5">
            Relative to MSRP/market
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#9BA39B]">Peak Competition</div>
          <div className="text-sm sm:text-base font-mono font-bold text-[#FACC15] truncate mt-1">
            {mostCompCategory}
          </div>
          <div className="text-[10px] font-mono text-[#68716B] mt-0.5">
            Highest bids per listing
          </div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#9BA39B]">Simulated Bids</div>
          <div className="text-2xl font-mono font-bold text-[#F5F7F2] mt-1">
            {totalSimulatedBids}
          </div>
          <div className="text-[10px] font-mono text-[#68716B] mt-0.5">
            Placed across catalog
          </div>
        </div>

        {/* KPI 6 */}
        <div className="p-4 bg-[#151919] border border-[#29302A] rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#9BA39B]">Avg Listing Time</div>
          <div className="text-2xl font-mono font-bold text-[#60A5FA] mt-1">
            48 Hrs
          </div>
          <div className="text-[10px] font-mono text-[#68716B] mt-0.5">
            Standard auction span
          </div>
        </div>
      </div>

      {/* DYNAMIC ANALYTICAL INSIGHTS PANEL */}
      <div className="bg-[#151919] border border-[#29302A] rounded-xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#F5F7F2]">
          <Lightbulb className="w-4 h-4 text-[#C6FF00]" />
          <span>REAL-TIME MARKETPLACE OBSERVATIONS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-[#9BA39B]">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#101313] rounded border border-[#29302A] flex items-start gap-2.5"
            >
              <span className="text-[#C6FF00] font-bold shrink-0">0{idx + 1}.</span>
              <p className="leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS GRID ROW 1: PRICE TRENDS & AUCTION ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Viz 1: Hardware Price Trends (7 Cols) */}
        <div className="lg:col-span-7 bg-[#151919] border border-[#29302A] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
                HARDWARE PRICE TRENDS
              </h3>
              <p className="text-xs font-mono text-[#9BA39B]">
                Price movements over time across key component categories
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101313] border border-[#29302A] text-[#9DFF3F] self-start sm:self-auto">
              Range: {dateRange.toUpperCase()}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceTrendData}>
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
                  formatter={(val: unknown) => [formatINR(Number(val) || 0)]}
                />
                <Legend wrapperStyle={{ fontFamily: "monospace", fontSize: "11px" }} />
                <Line
                  type="monotone"
                  dataKey="Graphics Cards"
                  stroke="#C6FF00"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Processors"
                  stroke="#9DFF3F"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Storage"
                  stroke="#FACC15"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Memory"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Viz 2: Auction Activity Area Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-[#151919] border border-[#29302A] rounded-xl p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              AUCTION ACTIVITY
            </h3>
            <p className="text-xs font-mono text-[#9BA39B]">
              Simulated bid placements and participating bidders
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6FF00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C6FF00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#29302A" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#9BA39B"
                  tick={{ fill: "#9BA39B", fontSize: 11, fontFamily: "monospace" }}
                />
                <YAxis
                  stroke="#9BA39B"
                  tick={{ fill: "#9BA39B", fontSize: 11, fontFamily: "monospace" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#101313",
                    borderColor: "#29302A",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bidsPlaced"
                  stroke="#C6FF00"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#bidGrad)"
                  name="Bids Placed"
                />
                <Area
                  type="monotone"
                  dataKey="activeBidders"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  fill="none"
                  name="Active Bidders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS GRID ROW 2: CATEGORY DISTRIBUTION & CURRENT BID VS MARKET VALUE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Viz 3: Category Distribution Donut (5 Cols) */}
        <div className="lg:col-span-5 bg-[#151919] border border-[#29302A] rounded-xl p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              MARKETPLACE COMPOSITION
            </h3>
            <p className="text-xs font-mono text-[#9BA39B]">
              Inventory distribution across component categories
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#101313",
                    borderColor: "#29302A",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                  formatter={(val: unknown, name: unknown) => [
                    `${val} listings`,
                    String(name),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Accessible Legend with Percentages */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-[#29302A]">
            {categoryDistributionData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate pr-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-[#9BA39B] truncate">{cat.name}</span>
                </div>
                <span className="text-[#F5F7F2] font-bold">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Viz 4: Current Bid vs Estimated Market Value (7 Cols) */}
        <div className="lg:col-span-7 bg-[#151919] border border-[#29302A] rounded-xl p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              BID VALUE VS MARKET VALUE
            </h3>
            <p className="text-xs font-mono text-[#9BA39B]">
              Comparison between current simulated bid and estimated market valuation
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bidVsMarketData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#29302A" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#9BA39B"
                  tick={{ fill: "#9BA39B", fontSize: 10, fontFamily: "monospace" }}
                  angle={-25}
                  textAnchor="end"
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
                <Legend wrapperStyle={{ fontFamily: "monospace", fontSize: "11px" }} />
                <Bar dataKey="currentBid" name="Current Bid" fill="#C6FF00" radius={[2, 2, 0, 0]} />
                <Bar dataKey="marketValue" name="Est. Market Value" fill="#60A5FA" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS GRID ROW 3: COMPETITIVE CATEGORIES & BID DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Viz 5: Most Competitive Categories Horizontal Bar (6 Cols) */}
        <div className="lg:col-span-6 bg-[#151919] border border-[#29302A] rounded-xl p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              MOST COMPETITIVE CATEGORIES
            </h3>
            <p className="text-xs font-mono text-[#9BA39B]">
              Average number of simulated bids placed per active hardware listing
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={competitiveData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#29302A" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#9BA39B"
                  tick={{ fill: "#9BA39B", fontSize: 11, fontFamily: "monospace" }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  stroke="#9BA39B"
                  tick={{ fill: "#9BA39B", fontSize: 10, fontFamily: "monospace" }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#101313",
                    borderColor: "#29302A",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                  formatter={(val: unknown) => [`${val} avg bids`, "Competition"]}
                />
                <Bar dataKey="avgBids" name="Avg Bids / Listing" fill="#9DFF3F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Viz 6: Bid Distribution Histogram (6 Cols) */}
        <div className="lg:col-span-6 bg-[#151919] border border-[#29302A] rounded-xl p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              BID VALUE DISTRIBUTION
            </h3>
            <p className="text-xs font-mono text-[#9BA39B]">
              Distribution of current auction bids across hardware price tiers
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bidDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#29302A" vertical={false} />
                <XAxis
                  dataKey="range"
                  stroke="#9BA39B"
                  tick={{ fill: "#9BA39B", fontSize: 11, fontFamily: "monospace" }}
                />
                <YAxis
                  stroke="#9BA39B"
                  tick={{ fill: "#9BA39B", fontSize: 11, fontFamily: "monospace" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#101313",
                    borderColor: "#29302A",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                  formatter={(val: unknown) => [`${val} items`, "Hardware Count"]}
                />
                <Bar dataKey="listings" name="Hardware Listings" fill="#FACC15" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* VIZ 7: AUCTION PERFORMANCE TABLE */}
      <div className="bg-[#151919] border border-[#29302A] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#F5F7F2]">
              AUCTION PERFORMANCE TELEMETRY
            </h3>
            <p className="text-xs font-mono text-[#9BA39B]">
              Granular breakdown of component pricing, bids, and market variance
            </p>
          </div>

          {/* Table Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#9BA39B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search table..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#101313] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2] outline-none focus:border-[#C6FF00]"
            />
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto rounded border border-[#29302A]">
          <table className="w-full text-left font-mono text-xs text-[#F5F7F2]">
            <thead className="bg-[#101313] border-b border-[#29302A] text-[#9BA39B] uppercase text-[11px]">
              <tr>
                <th
                  onClick={() => toggleSort("name")}
                  className="py-3 px-4 cursor-pointer hover:text-[#C6FF00]"
                >
                  <div className="flex items-center gap-1">
                    <span>Component Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Category</th>
                <th
                  onClick={() => toggleSort("currentBid")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#C6FF00]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Current Bid</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("estimatedMarketValue")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#C6FF00]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Est. Market</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("bidCount")}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#C6FF00]"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Bids</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("percentOfValue")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#C6FF00]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>% of Est. Value</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29302A]/60 bg-[#151919]">
              {tableProducts.map((p) => {
                const ratio = Math.round((p.currentBid / p.estimatedMarketValue) * 100);
                return (
                  <tr key={p.id} className="hover:bg-[#1B2020] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#F5F7F2]">
                      <Link
                        href={`/product/${p.id}`}
                        className="hover:text-[#C6FF00] transition-colors"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[#9BA39B]">{p.category}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#C6FF00]">
                      {formatINR(p.currentBid)}
                    </td>
                    <td className="py-3 px-4 text-right text-[#9BA39B]">
                      {formatINR(p.estimatedMarketValue)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{p.bidCount}</td>
                    <td className="py-3 px-4 text-right font-bold">
                      <span
                        className={
                          ratio <= 90
                            ? "text-[#4ADE80]"
                            : ratio <= 100
                            ? "text-[#FACC15]"
                            : "text-[#FB7185]"
                        }
                      >
                        {ratio}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          p.status === "active"
                            ? "bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/30"
                            : "bg-[#101313] text-[#68716B] border border-[#29302A]"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/product/${p.id}`}
                        className="px-2.5 py-1 bg-[#101313] hover:bg-[#C6FF00] text-[#9BA39B] hover:text-[#080A0A] rounded border border-[#29302A] text-[11px] transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
