"use client";

import React, { useState, useMemo } from "react";
import { useAuction } from "@/context/AuctionContext";
import { ProductCard } from "@/components/products/ProductCard";
import { BidModal } from "@/components/auctions/BidModal";
import { ProductCategory, ProductCondition, AuctionStatus, Product } from "@/types";
import { CATEGORIES, MANUFACTURERS } from "@/data/products";
import { formatINR } from "@/lib/formatters";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  X,
  Cpu,
  Flame,
} from "lucide-react";

export default function ExplorePage() {
  const { products } = useAuction();
  const [selectedProductForBid, setSelectedProductForBid] = useState<Product | null>(null);

  // Filter States
  const [currentTime, setCurrentTime] = useState<number>(() =>
    new Date("2026-10-30T16:00:00.000Z").getTime()
  );
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All">("All");
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<AuctionStatus | "All">("All");
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | "All">("All");
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [endingSoonOnly, setEndingSoonOnly] = useState(false);
  const [buyNowOnly, setBuyNowOnly] = useState(false);

  React.useEffect(() => {
    setCurrentTime(Date.now());
  }, []);

  // Sorting and Display
  const [sortBy, setSortBy] = useState<
    "endingSoon" | "lowestBid" | "highestBid" | "mostBids" | "recentlyListed" | "highestMarketValue"
  >("endingSoon");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pageLimit, setPageLimit] = useState(9);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          Object.values(p.specifications).some((spec) =>
            String(spec).toLowerCase().includes(q)
          );
        if (!match) return false;
      }

      // Category
      if (selectedCategory !== "All" && p.category !== selectedCategory) {
        return false;
      }

      // Condition
      if (selectedCondition !== "All" && p.condition !== selectedCondition) {
        return false;
      }

      // Status
      if (selectedStatus !== "All" && p.status !== selectedStatus) {
        return false;
      }

      // Manufacturer
      if (selectedManufacturer !== "All" && p.manufacturer !== selectedManufacturer) {
        return false;
      }

      // Max Current Bid
      if (p.currentBid > maxPrice) {
        return false;
      }

      // Ending Soon (< 3 hours)
      if (endingSoonOnly) {
        const diffSec = Math.floor(
          (new Date(p.endTime).getTime() - currentTime) / 1000
        );
        if (diffSec <= 0 || diffSec > 3 * 3600) {
          return false;
        }
      }

      // Buy Now availability
      if (buyNowOnly && !p.buyNowPrice) {
        return false;
      }

      return true;
    });
  }, [
    products,
    search,
    selectedCategory,
    selectedCondition,
    selectedStatus,
    selectedManufacturer,
    maxPrice,
    endingSoonOnly,
    buyNowOnly,
    currentTime,
  ]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case "endingSoon":
        return list.sort((a, b) => {
          const aTime = new Date(a.endTime).getTime();
          const bTime = new Date(b.endTime).getTime();
          const aPast = aTime <= currentTime;
          const bPast = bTime <= currentTime;
          if (aPast && !bPast) return 1;
          if (!aPast && bPast) return -1;
          return aTime - bTime;
        });
      case "lowestBid":
        return list.sort((a, b) => a.currentBid - b.currentBid);
      case "highestBid":
        return list.sort((a, b) => b.currentBid - a.currentBid);
      case "mostBids":
        return list.sort((a, b) => b.bidCount - a.bidCount);
      case "highestMarketValue":
        return list.sort((a, b) => b.estimatedMarketValue - a.estimatedMarketValue);
      case "recentlyListed":
      default:
        return list;
    }
  }, [filteredProducts, sortBy, currentTime]);

  const paginatedList = sortedProducts.slice(0, pageLimit);
  const hasMore = paginatedList.length < sortedProducts.length;

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedCondition("All");
    setSelectedStatus("All");
    setSelectedManufacturer("All");
    setMaxPrice(200000);
    setEndingSoonOnly(false);
    setBuyNowOnly(false);
    setSortBy("endingSoon");
    setPageLimit(9);
  };

  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedCondition !== "All" ? 1 : 0) +
    (selectedStatus !== "All" ? 1 : 0) +
    (selectedManufacturer !== "All" ? 1 : 0) +
    (maxPrice < 200000 ? 1 : 0) +
    (endingSoonOnly ? 1 : 0) +
    (buyNowOnly ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#29302A] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#C6FF00] mb-1">
            Hardware Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F5F7F2] tracking-tight">
            EXPLORE HARDWARE
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#9BA39B] mt-1.5">
            Find components worth competing for. Simulated live prices, verified specs, and active bidding.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex md:hidden items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex-1 py-2.5 px-4 bg-[#151919] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2] flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C6FF00]" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block bg-[#151919] border border-[#29302A] rounded-lg p-5 space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-[#29302A]">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#F5F7F2]">
              <SlidersHorizontal className="w-4 h-4 text-[#C6FF00]" />
              <span>FILTERS</span>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-mono text-[#9BA39B] hover:text-[#FB7185] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9BA39B] mb-2 font-semibold">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono transition-colors flex items-center justify-between ${
                  selectedCategory === "All"
                    ? "bg-[#C6FF00]/10 text-[#C6FF00] font-bold border border-[#C6FF00]/30"
                    : "text-[#9BA39B] hover:text-[#F5F7F2] hover:bg-[#101313]"
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] text-[#68716B]">{products.length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? "bg-[#C6FF00]/10 text-[#C6FF00] font-bold border border-[#C6FF00]/30"
                        : "text-[#9BA39B] hover:text-[#F5F7F2] hover:bg-[#101313]"
                    }`}
                  >
                    <span className="truncate pr-1">{cat}</span>
                    <span className="text-[10px] text-[#68716B]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max Price Range Filter */}
          <div className="pt-4 border-t border-[#29302A]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase text-[#9BA39B] font-semibold">
                Max Current Bid
              </label>
              <span className="text-xs font-mono font-bold text-[#C6FF00]">
                {formatINR(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={200000}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#C6FF00] bg-[#101313] h-1.5 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#68716B] mt-1">
              <span>₹10,000</span>
              <span>₹2,00,000+</span>
            </div>
          </div>

          {/* Condition Filter */}
          <div className="pt-4 border-t border-[#29302A]">
            <label className="block text-xs font-mono uppercase text-[#9BA39B] mb-2 font-semibold">
              Condition
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(["All", "New", "Like New", "Used", "Refurbished"] as const).map(
                (cond) => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`px-2 py-1.5 text-xs font-mono rounded border text-center transition-colors ${
                      selectedCondition === cond
                        ? "border-[#C6FF00] bg-[#C6FF00]/10 text-[#C6FF00] font-bold"
                        : "border-[#29302A] text-[#9BA39B] hover:text-[#F5F7F2] bg-[#101313]"
                    }`}
                  >
                    {cond}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Manufacturer Filter */}
          <div className="pt-4 border-t border-[#29302A]">
            <label className="block text-xs font-mono uppercase text-[#9BA39B] mb-2 font-semibold">
              Manufacturer
            </label>
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="w-full px-3 py-2 bg-[#101313] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2] outline-none focus:border-[#C6FF00]"
            >
              <option value="All">All Manufacturers</option>
              {MANUFACTURERS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Special Toggles */}
          <div className="pt-4 border-t border-[#29302A] space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#F5F7F2]">
              <input
                type="checkbox"
                checked={endingSoonOnly}
                onChange={(e) => setEndingSoonOnly(e.target.checked)}
                className="w-4 h-4 accent-[#C6FF00] rounded"
              />
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#FB7185]" />
                <span>Ending Soon Only (&lt; 3h)</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#F5F7F2]">
              <input
                type="checkbox"
                checked={buyNowOnly}
                onChange={(e) => setBuyNowOnly(e.target.checked)}
                className="w-4 h-4 accent-[#C6FF00] rounded"
              />
              <span>Buy-Now Price Listed</span>
            </label>
          </div>
        </aside>

        {/* MAIN LISTINGS AREA */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Controls Toolbar */}
          <div className="bg-[#151919] border border-[#29302A] rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9BA39B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search component name, specs, architecture..."
                className="w-full pl-9 pr-8 py-2 bg-[#101313] border border-[#29302A] focus:border-[#C6FF00] rounded font-mono text-xs text-[#F5F7F2] outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9BA39B] hover:text-[#F5F7F2]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sorting & View Mode Buttons */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e: unknown) =>
                  setSortBy(
                    (e as React.ChangeEvent<HTMLSelectElement>).target.value as typeof sortBy
                  )
                }
                className="px-3 py-2 bg-[#101313] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2] outline-none focus:border-[#C6FF00] cursor-pointer"
              >
                <option value="endingSoon">Sort: Ending Soon</option>
                <option value="lowestBid">Sort: Lowest Current Bid</option>
                <option value="highestBid">Sort: Highest Current Bid</option>
                <option value="mostBids">Sort: Most Bids</option>
                <option value="highestMarketValue">Sort: Highest Market Value</option>
              </select>

              {/* View Mode Buttons */}
              <div className="flex items-center bg-[#101313] border border-[#29302A] rounded p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#C6FF00] text-[#080A0A]"
                      : "text-[#9BA39B] hover:text-[#F5F7F2]"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-[#C6FF00] text-[#080A0A]"
                      : "text-[#9BA39B] hover:text-[#F5F7F2]"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-[#68716B]">Active filters:</span>
              {selectedCategory !== "All" && (
                <span className="px-2 py-0.5 rounded bg-[#101313] border border-[#29302A] text-[#C6FF00] flex items-center gap-1">
                  Cat: {selectedCategory}
                  <button onClick={() => setSelectedCategory("All")}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}
              {selectedCondition !== "All" && (
                <span className="px-2 py-0.5 rounded bg-[#101313] border border-[#29302A] text-[#9DFF3F] flex items-center gap-1">
                  Condition: {selectedCondition}
                  <button onClick={() => setSelectedCondition("All")}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}
              {selectedManufacturer !== "All" && (
                <span className="px-2 py-0.5 rounded bg-[#101313] border border-[#29302A] text-[#FACC15] flex items-center gap-1">
                  Brand: {selectedManufacturer}
                  <button onClick={() => setSelectedManufacturer("All")}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}
              {endingSoonOnly && (
                <span className="px-2 py-0.5 rounded bg-[#101313] border border-[#29302A] text-[#FB7185] flex items-center gap-1">
                  Ending Soon
                  <button onClick={() => setEndingSoonOnly(false)}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-[#68716B] hover:text-[#FB7185] underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Result Count Indicator */}
          <div className="flex items-center justify-between text-xs font-mono text-[#9BA39B]">
            <span>
              Showing <strong className="text-[#F5F7F2]">{paginatedList.length}</strong> of{" "}
              <strong className="text-[#C6FF00]">{sortedProducts.length}</strong> components
            </span>
          </div>

          {/* Products Grid or List */}
          {paginatedList.length === 0 ? (
            <div className="bg-[#151919] border border-[#29302A] rounded-xl p-12 text-center space-y-4">
              <Cpu className="w-12 h-12 text-[#68716B] mx-auto opacity-50" />
              <h3 className="font-heading font-bold text-lg text-[#F5F7F2]">
                No Components Found
              </h3>
              <p className="text-xs font-mono text-[#9BA39B] max-w-sm mx-auto">
                No hardware listings matched your current filter combinations. Try
                broadening your search or clearing active filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {paginatedList.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onOpenBid={(p) => setSelectedProductForBid(p)}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-8">
              <button
                onClick={() => setPageLimit((prev) => prev + 6)}
                className="px-8 py-3 bg-[#151919] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#C6FF00] text-[#F5F7F2] font-mono text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Load More Components ({sortedProducts.length - paginatedList.length} remaining)
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#080A0A] p-6 overflow-y-auto animate-fade-in lg:hidden">
          <div className="flex items-center justify-between pb-4 border-b border-[#29302A]">
            <h3 className="font-heading font-bold text-lg text-[#F5F7F2]">Filters</h3>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="p-2 text-[#9BA39B] hover:text-[#F5F7F2]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="py-6 space-y-6">
            {/* Category */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#9BA39B] mb-2 font-semibold">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as ProductCategory | "All")
                }
                className="w-full px-3 py-2.5 bg-[#101313] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2]"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-[#9BA39B] font-semibold">
                  Max Bid Price
                </label>
                <span className="text-xs font-mono font-bold text-[#C6FF00]">
                  {formatINR(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={200000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C6FF00] h-2 bg-[#151919] rounded"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#9BA39B] mb-2 font-semibold">
                Condition
              </label>
              <select
                value={selectedCondition}
                onChange={(e) =>
                  setSelectedCondition(e.target.value as ProductCondition | "All")
                }
                className="w-full px-3 py-2.5 bg-[#101313] border border-[#29302A] rounded font-mono text-xs text-[#F5F7F2]"
              >
                {["All", "New", "Like New", "Used", "Refurbished"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Ending Soon */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 font-mono text-xs text-[#F5F7F2]">
                <input
                  type="checkbox"
                  checked={endingSoonOnly}
                  onChange={(e) => setEndingSoonOnly(e.target.checked)}
                  className="w-5 h-5 accent-[#C6FF00]"
                />
                <span>Ending Soon Only (&lt; 3 hours)</span>
              </label>

              <label className="flex items-center gap-3 font-mono text-xs text-[#F5F7F2]">
                <input
                  type="checkbox"
                  checked={buyNowOnly}
                  onChange={(e) => setBuyNowOnly(e.target.checked)}
                  className="w-5 h-5 accent-[#C6FF00]"
                />
                <span>Buy-Now Price Available</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#29302A] flex gap-3">
            <button
              onClick={resetFilters}
              className="flex-1 py-3 bg-[#151919] border border-[#29302A] text-xs font-mono text-[#F5F7F2] rounded"
            >
              Reset
            </button>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="flex-1 py-3 bg-[#C6FF00] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded glow-lime-sm"
            >
              Apply ({filteredProducts.length})
            </button>
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
