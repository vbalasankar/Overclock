import { Product, ProductCategory } from "@/types";

export interface AnalyticsFilters {
  dateRange: "7d" | "30d" | "90d" | "all";
  category: ProductCategory | "All";
  manufacturer: string | "All";
  status: "active" | "ended" | "All";
}

export function filterProductsForAnalytics(
  products: Product[],
  filters: AnalyticsFilters
): Product[] {
  return products.filter((p) => {
    if (filters.category !== "All" && p.category !== filters.category) {
      return false;
    }
    if (filters.manufacturer !== "All" && p.manufacturer !== filters.manufacturer) {
      return false;
    }
    if (filters.status !== "All" && p.status !== filters.status) {
      return false;
    }
    return true;
  });
}

// 1. Hardware Price Trends (historical time series by category)
export function getCategoryPriceTrends(range: "7d" | "30d" | "90d" | "all") {
  // Coherent trend data based on market observations
  if (range === "7d") {
    return [
      { date: "Oct 24", "Graphics Cards": 82000, Processors: 39500, Memory: 16000, Storage: 16200 },
      { date: "Oct 25", "Graphics Cards": 81500, Processors: 39200, Memory: 15800, Storage: 15900 },
      { date: "Oct 26", "Graphics Cards": 83000, Processors: 38900, Memory: 15600, Storage: 15700 },
      { date: "Oct 27", "Graphics Cards": 82400, Processors: 38500, Memory: 15500, Storage: 15500 },
      { date: "Oct 28", "Graphics Cards": 81900, Processors: 38200, Memory: 15400, Storage: 15300 },
      { date: "Oct 29", "Graphics Cards": 81200, Processors: 37900, Memory: 15300, Storage: 15100 },
      { date: "Oct 30", "Graphics Cards": 80800, Processors: 37600, Memory: 15200, Storage: 14900 },
    ];
  } else if (range === "90d") {
    return [
      { date: "Aug 05", "Graphics Cards": 92000, Processors: 44000, Memory: 18500, Storage: 18800 },
      { date: "Aug 20", "Graphics Cards": 89500, Processors: 43200, Memory: 18000, Storage: 18200 },
      { date: "Sep 05", "Graphics Cards": 87000, Processors: 42000, Memory: 17400, Storage: 17500 },
      { date: "Sep 20", "Graphics Cards": 85500, Processors: 40800, Memory: 16800, Storage: 16900 },
      { date: "Oct 05", "Graphics Cards": 84000, Processors: 39800, Memory: 16200, Storage: 16100 },
      { date: "Oct 20", "Graphics Cards": 82200, Processors: 38800, Memory: 15600, Storage: 15400 },
      { date: "Oct 30", "Graphics Cards": 80800, Processors: 37600, Memory: 15200, Storage: 14900 },
    ];
  } else {
    // 30d and all-time default
    return [
      { date: "Oct 01", "Graphics Cards": 85000, Processors: 41000, Memory: 17000, Storage: 17500 },
      { date: "Oct 06", "Graphics Cards": 84200, Processors: 40500, Memory: 16800, Storage: 17100 },
      { date: "Oct 11", "Graphics Cards": 83800, Processors: 40000, Memory: 16400, Storage: 16800 },
      { date: "Oct 16", "Graphics Cards": 83100, Processors: 39400, Memory: 16100, Storage: 16200 },
      { date: "Oct 21", "Graphics Cards": 82500, Processors: 38900, Memory: 15700, Storage: 15800 },
      { date: "Oct 26", "Graphics Cards": 81800, Processors: 38200, Memory: 15400, Storage: 15200 },
      { date: "Oct 30", "Graphics Cards": 80800, Processors: 37600, Memory: 15200, Storage: 14900 },
    ];
  }
}

// 2. Auction Activity (Time series of bid volume)
export function getAuctionActivityData(range: "7d" | "30d" | "90d" | "all") {
  if (range === "7d") {
    return [
      { date: "Oct 24", bidsPlaced: 34, activeBidders: 18, totalVolume: 1850000 },
      { date: "Oct 25", bidsPlaced: 42, activeBidders: 23, totalVolume: 2240000 },
      { date: "Oct 26", bidsPlaced: 58, activeBidders: 29, totalVolume: 3100000 },
      { date: "Oct 27", bidsPlaced: 51, activeBidders: 26, totalVolume: 2890000 },
      { date: "Oct 28", bidsPlaced: 49, activeBidders: 24, totalVolume: 2650000 },
      { date: "Oct 29", bidsPlaced: 67, activeBidders: 34, totalVolume: 3780000 },
      { date: "Oct 30", bidsPlaced: 78, activeBidders: 41, totalVolume: 4250000 },
    ];
  }
  return [
    { date: "Oct 01", bidsPlaced: 28, activeBidders: 15, totalVolume: 1450000 },
    { date: "Oct 06", bidsPlaced: 35, activeBidders: 19, totalVolume: 1920000 },
    { date: "Oct 11", bidsPlaced: 44, activeBidders: 22, totalVolume: 2340000 },
    { date: "Oct 16", bidsPlaced: 53, activeBidders: 27, totalVolume: 2890000 },
    { date: "Oct 21", bidsPlaced: 48, activeBidders: 25, totalVolume: 2620000 },
    { date: "Oct 26", bidsPlaced: 62, activeBidders: 31, totalVolume: 3420000 },
    { date: "Oct 30", bidsPlaced: 78, activeBidders: 41, totalVolume: 4250000 },
  ];
}

// 3. Category Distribution (Marketplace Composition)
export function getCategoryDistribution(products: Product[]) {
  const counts: Record<string, { count: number; totalValue: number }> = {};

  products.forEach((p) => {
    if (!counts[p.category]) {
      counts[p.category] = { count: 0, totalValue: 0 };
    }
    counts[p.category].count += 1;
    counts[p.category].totalValue += p.currentBid;
  });

  const total = products.length || 1;
  const colors: Record<string, string> = {
    "Graphics Cards": "#C6FF00",
    Processors: "#9DFF3F",
    Memory: "#60A5FA",
    Storage: "#FACC15",
    Motherboards: "#A78BFA",
    Cooling: "#38BDF8",
    "Power Supplies": "#F472B6",
    Cases: "#4ADE80",
    "Other Components": "#94A3B8",
  };

  return Object.entries(counts).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.totalValue,
    percentage: Number(((data.count / total) * 100).toFixed(1)),
    color: colors[name] || "#C6FF00",
  }));
}

// 4. Current Bid vs Estimated Market Value
export function getBidVsMarketValue(products: Product[]) {
  return products.slice(0, 10).map((p) => {
    const diff = p.currentBid - p.estimatedMarketValue;
    const diffPercent = Number(((diff / p.estimatedMarketValue) * 100).toFixed(1));
    return {
      id: p.id,
      name: p.name.length > 20 ? p.name.slice(0, 18) + "..." : p.name,
      fullName: p.name,
      currentBid: p.currentBid,
      marketValue: p.estimatedMarketValue,
      difference: diff,
      diffPercent,
      category: p.category,
      status: diff > 0 ? "Above Market" : "Below Market",
    };
  });
}

// 5. Competitive Categories (Avg bids per active listing)
export function getCompetitiveCategories(products: Product[]) {
  const categoryStats: Record<string, { totalBids: number; count: number }> = {};

  products.forEach((p) => {
    if (!categoryStats[p.category]) {
      categoryStats[p.category] = { totalBids: 0, count: 0 };
    }
    categoryStats[p.category].totalBids += p.bidCount;
    categoryStats[p.category].count += 1;
  });

  return Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      avgBids: Number((stats.totalBids / stats.count).toFixed(1)),
      totalBids: stats.totalBids,
      listingCount: stats.count,
    }))
    .sort((a, b) => b.avgBids - a.avgBids);
}

// 6. Bid Distribution across price bins
export function getBidDistribution(products: Product[]) {
  const bins = [
    { range: "< ₹15k", min: 0, max: 15000, count: 0 },
    { range: "₹15k - ₹30k", min: 15000, max: 30000, count: 0 },
    { range: "₹30k - ₹50k", min: 30000, max: 50000, count: 0 },
    { range: "₹50k - ₹80k", min: 50000, max: 80000, count: 0 },
    { range: "> ₹80k", min: 80000, max: Infinity, count: 0 },
  ];

  products.forEach((p) => {
    const bin = bins.find((b) => p.currentBid >= b.min && p.currentBid < b.max);
    if (bin) {
      bin.count += 1;
    }
  });

  return bins.map((b) => ({
    range: b.range,
    listings: b.count,
  }));
}

// 7. Dynamic Data-Driven Analytical Insights
export function generateAnalyticalInsights(products: Product[]): string[] {
  if (products.length === 0) {
    return ["No products match the selected filters."];
  }

  const insights: string[] = [];

  // Insight 1: Largest category
  const catDistribution = getCategoryDistribution(products);
  if (catDistribution.length > 0) {
    const topCat = [...catDistribution].sort((a, b) => b.count - a.count)[0];
    insights.push(
      `${topCat.name} represents the largest market share with ${topCat.count} listings (${topCat.percentage}% of active inventory).`
    );
  }

  // Insight 2: Most competitive category
  const compCats = getCompetitiveCategories(products);
  if (compCats.length > 0) {
    const mostComp = compCats[0];
    insights.push(
      `${mostComp.category} is the most fiercely contested tier, averaging ${mostComp.avgBids} simulated bids per listing.`
    );
  }

  // Insight 3: Below market value opportunities
  const belowMarketCount = products.filter(
    (p) => p.currentBid < p.estimatedMarketValue
  ).length;
  const belowMarketPercent = Math.round((belowMarketCount / products.length) * 100);
  insights.push(
    `${belowMarketCount} of ${products.length} components (${belowMarketPercent}%) are currently bidding below estimated market valuation.`
  );

  // Insight 4: High bidder activity item
  const highestBidProduct = [...products].sort((a, b) => b.bidCount - a.bidCount)[0];
  if (highestBidProduct) {
    insights.push(
      `"${highestBidProduct.name}" commands peak activity with ${highestBidProduct.bidCount} bids recorded.`
    );
  }

  return insights;
}
