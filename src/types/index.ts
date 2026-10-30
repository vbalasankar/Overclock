export type ProductCategory =
  | "Graphics Cards"
  | "Processors"
  | "Memory"
  | "Storage"
  | "Motherboards"
  | "Cooling"
  | "Power Supplies"
  | "Cases"
  | "Other Components";

export type ProductCondition = "New" | "Like New" | "Used" | "Refurbished";

export type AuctionStatus = "active" | "ended";

export interface Bid {
  id: string;
  bidderName: string;
  amount: number;
  timestamp: string;
  isDemo: boolean;
  isUserBid?: boolean;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  category: ProductCategory;
  condition: ProductCondition;
  image: string;
  gallery: string[];
  description: string;
  startingBid: number;
  currentBid: number;
  estimatedMarketValue: number;
  minimumBidIncrement: number;
  bidCount: number;
  watcherCount: number;
  endTime: string;
  status: AuctionStatus;
  sellerName: string;
  sellerRating: number;
  specifications: Record<string, string | number>;
  bids: Bid[];
  priceHistory: PricePoint[];
  featured?: boolean;
  buyNowPrice?: number;
}

export interface AuctionFilterState {
  search: string;
  category: ProductCategory | "All";
  condition: ProductCondition | "All";
  status: AuctionStatus | "All";
  manufacturer: string | "All";
  minPrice: number;
  maxPrice: number;
  endingSoonOnly: boolean;
  buyNowOnly: boolean;
  sortBy:
    | "endingSoon"
    | "lowestBid"
    | "highestBid"
    | "mostBids"
    | "recentlyListed"
    | "highestMarketValue";
  viewMode: "grid" | "list";
}

export interface MarketMetrics {
  activeAuctions: number;
  totalMarketValue: number;
  averageWinningPrice: number;
  endingSoonCount: number;
  totalSimulatedBids: number;
  avgBidToValueRatio: number;
  mostCompetitiveCategory: string;
}
