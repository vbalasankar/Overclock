import React, { Suspense } from "react";
import type { Metadata } from "next";
import { INITIAL_PRODUCTS } from "@/data/products";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.id === resolved.id);

  if (!product) {
    return {
      title: "Hardware Listing Not Found | OVERCLOCK",
      description: "The requested computer hardware auction listing could not be found.",
    };
  }

  return {
    title: `${product.name} | OVERCLOCK Auction`,
    description: `Compete in simulated hardware auctions for ${product.name}. Current bid: ₹${product.currentBid.toLocaleString("en-IN")}. Bid Beyond Limits on Overclock.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolved = await params;
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs font-mono text-[#9BA39B]">
          Loading hardware auction telemetrics...
        </div>
      }
    >
      <ProductDetailClient id={resolved.id} />
    </Suspense>
  );
}
