"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuction } from "@/context/AuctionContext";
import { formatINR } from "@/lib/formatters";
import { Search, X, ChevronRight, Cpu } from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const { products } = useAuction();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Keyboard shortcut listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      })
    : products.slice(0, 6); // show top 6 recommended if empty query

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#151919] border border-[#29302A] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-[#29302A] bg-[#101313]">
          <Search className="w-5 h-5 text-[#C6FF00] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GPUs, CPUs, RAM, SSDs, models, chips..."
            className="w-full py-4 bg-transparent outline-none font-mono text-sm sm:text-base text-[#F5F7F2] placeholder-[#68716B]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#9BA39B] hover:text-[#F5F7F2] mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono bg-[#1B2020] hover:bg-[#29302A] text-[#9BA39B] rounded border border-[#29302A]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1.5 flex-1 divide-y divide-[#29302A]/40">
          <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#9BA39B] flex items-center justify-between">
            <span>{query ? `Search Results (${filtered.length})` : "Featured Hardware"}</span>
            <span className="text-[#68716B]">Jump directly to product</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <Cpu className="w-10 h-10 text-[#68716B] mx-auto mb-2 opacity-50" />
              <p className="font-heading text-sm text-[#F5F7F2]">No hardware found</p>
              <p className="font-mono text-xs text-[#9BA39B] mt-1">
                No components matched &ldquo;{query}&rdquo;. Try searching RTX, Ryzen, DDR5, or NVMe.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                onClick={onClose}
                className="group flex items-center justify-between p-3 rounded hover:bg-[#1B2020] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="w-10 h-10 rounded bg-[#101313] border border-[#29302A] overflow-hidden shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading font-bold text-sm text-[#F5F7F2] group-hover:text-[#C6FF00] truncate transition-colors">
                      {item.name}
                    </div>
                    <div className="text-xs font-mono text-[#9BA39B] flex items-center gap-2">
                      <span className="text-[#C6FF00]">{item.category}</span>
                      <span>•</span>
                      <span>{item.condition}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#9BA39B]">Current Bid</div>
                    <div className="text-sm font-mono font-bold text-[#F5F7F2]">
                      {formatINR(item.currentBid)}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#68716B] group-hover:text-[#C6FF00] transition-colors" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#101313] border-t border-[#29302A] flex items-center justify-between text-[11px] font-mono text-[#68716B]">
          <span>Tip: Press [Esc] anytime to close search</span>
          <Link
            href="/explore"
            onClick={onClose}
            className="text-[#C6FF00] hover:underline"
          >
            View all {products.length} hardware items &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
