"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { useAuction } from "@/context/AuctionContext";
import { formatINR } from "@/lib/formatters";
import { X, ShieldAlert, CheckCircle2, Zap, ArrowUpRight } from "lucide-react";
import confetti from "canvas-confetti";

interface BidModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BidModal({ product, isOpen, onClose }: BidModalProps) {
  const { placeBid } = useAuction();
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidderName, setBidderName] = useState<string>("Pilot");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minNextBid = product
    ? product.currentBid + product.minimumBidIncrement
    : 0;

  useEffect(() => {
    if (product) {
      setBidAmount(product.currentBid + product.minimumBidIncrement);
      setError(null);
      setSuccessMessage(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleIncrement = (increment: number) => {
    setBidAmount((prev) => Math.max(minNextBid, (prev || minNextBid) + increment));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);

    if (bidAmount < minNextBid) {
      setError(
        `Bid must be at least ${formatINR(minNextBid)} (Minimum increment is ${formatINR(
          product.minimumBidIncrement
        )})`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = placeBid(product.id, bidAmount, bidderName || "Pilot");
      if (result.success) {
        setSuccessMessage(result.message);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#C6FF00", "#9DFF3F", "#FFFFFF"],
          });
        } catch {
          // Ignore if canvas-confetti is not loaded
        }
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setError(result.message);
      }
    } catch {
      setError("An unexpected error occurred while placing your bid.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#151919] border border-[#29302A] rounded-lg shadow-2xl p-6 sm:p-7 overflow-hidden text-[#F5F7F2]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bid-modal-title"
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C6FF00] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#9BA39B] hover:text-[#F5F7F2] hover:bg-[#1B2020] rounded-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C6FF00] uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Auction Arena · Simulated Bid</span>
          </div>
          <h2
            id="bid-modal-title"
            className="text-lg sm:text-xl font-bold font-heading line-clamp-2"
          >
            {product.name}
          </h2>
          <div className="text-xs text-[#9BA39B] font-mono mt-1">
            ID: <span className="text-[#F5F7F2]">{product.id}</span> · Category:{" "}
            <span className="text-[#F5F7F2]">{product.category}</span>
          </div>
        </div>

        {/* Pricing Summary Box */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-[#101313] border border-[#29302A] rounded mb-5">
          <div>
            <div className="text-xs text-[#9BA39B] font-mono uppercase">Current Highest Bid</div>
            <div className="text-xl font-mono font-bold text-[#F5F7F2] mt-0.5">
              {formatINR(product.currentBid)}
            </div>
            <div className="text-[11px] text-[#68716B] font-mono">
              {product.bidCount} bids placed
            </div>
          </div>
          <div className="border-l border-[#29302A] pl-3">
            <div className="text-xs text-[#9BA39B] font-mono uppercase">Minimum Allowed Bid</div>
            <div className="text-xl font-mono font-bold text-[#C6FF00] mt-0.5">
              {formatINR(minNextBid)}
            </div>
            <div className="text-[11px] text-[#9DFF3F] font-mono">
              + {formatINR(product.minimumBidIncrement)} increment
            </div>
          </div>
        </div>

        {successMessage ? (
          <div className="p-4 bg-[#4ADE80]/10 border border-[#4ADE80]/40 rounded text-center my-6 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-[#4ADE80] mx-auto mb-2" />
            <h4 className="font-bold text-[#4ADE80] text-base">Bid Recorded!</h4>
            <p className="text-xs text-[#F5F7F2] mt-1">{successMessage}</p>
            <p className="text-[11px] text-[#9BA39B] mt-2 font-mono">
              Synchronizing with Arena and Market Intelligence...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="bidder-alias"
                className="block text-xs font-mono uppercase tracking-wider text-[#9BA39B] mb-1.5"
              >
                Bidder Call-Sign / Alias
              </label>
              <input
                id="bidder-alias"
                type="text"
                value={bidderName}
                onChange={(e) => setBidderName(e.target.value)}
                placeholder="e.g. CyberViper, Pilot, Overclocker"
                maxLength={24}
                className="w-full px-3.5 py-2.5 bg-[#101313] border border-[#29302A] focus:border-[#C6FF00] focus:ring-1 focus:ring-[#C6FF00] outline-none rounded font-mono text-sm text-[#F5F7F2] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="bid-amount"
                className="block text-xs font-mono uppercase tracking-wider text-[#9BA39B] mb-1.5"
              >
                Your Bid Amount (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA39B] font-mono font-bold">
                  ₹
                </span>
                <input
                  id="bid-amount"
                  type="number"
                  value={bidAmount || ""}
                  min={minNextBid}
                  step={product.minimumBidIncrement}
                  onChange={(e) => {
                    setBidAmount(Number(e.target.value));
                    setError(null);
                  }}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-[#101313] border border-[#29302A] focus:border-[#C6FF00] focus:ring-1 focus:ring-[#C6FF00] outline-none rounded font-mono text-base font-bold text-[#F5F7F2] transition-colors"
                />
              </div>
            </div>

            {/* Quick Increment Buttons */}
            <div>
              <div className="text-[11px] font-mono text-[#9BA39B] mb-1.5">
                Quick Increment Shortcuts:
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2500, 5000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => handleIncrement(inc)}
                    className="py-1.5 px-2 bg-[#1B2020] hover:bg-[#29302A] border border-[#29302A] hover:border-[#C6FF00] text-xs font-mono rounded text-[#F5F7F2] hover:text-[#C6FF00] transition-colors text-center"
                  >
                    +{formatINR(inc)}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[#FB7185]/10 border border-[#FB7185]/40 rounded text-xs text-[#FB7185] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#C6FF00] hover:bg-[#9DFF3F] disabled:opacity-50 text-[#080A0A] font-heading font-bold text-sm tracking-wider uppercase rounded transition-all flex items-center justify-center gap-2 glow-lime-sm cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isSubmitting ? "Transmitting Bid..." : `Confirm Bid of ${formatINR(bidAmount)}`}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* University Demo Notice */}
        <div className="mt-5 pt-4 border-t border-[#29302A] flex items-center justify-between text-[11px] text-[#68716B] font-mono">
          <span>SIMULATED TRANSACTION</span>
          <span>NO ACTUAL PAYMENTS CHARGED</span>
        </div>
      </div>
    </div>
  );
}

