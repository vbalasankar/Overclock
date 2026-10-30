"use client";

import React from "react";
import Link from "next/link";
import { useAuction } from "@/context/AuctionContext";
import { Zap, ShieldCheck, RefreshCw, Cpu, Activity, Terminal } from "lucide-react";

export function Footer() {
  const { resetAllData } = useAuction();

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all simulated bids, watchlist items, and restore initial hardware data?"
      )
    ) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <footer className="bg-[#080A0A] border-t border-[#29302A] text-[#9BA39B] pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#29302A]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-[#151919] border border-[#29302A] group-hover:border-[#C6FF00] flex items-center justify-center transition-colors">
                <Zap className="w-4 h-4 text-[#C6FF00] fill-current" />
              </div>
              <span className="font-heading text-xl font-bold tracking-widest text-[#F5F7F2]">
                OVERCLOCK
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#9BA39B] max-w-sm leading-relaxed">
              Data-driven computer hardware bidding and market intelligence.
              Discover rare components, compete in simulated live auctions, and analyze
              hardware market movements in real time.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#151919] border border-[#29302A] text-[11px] font-mono text-[#9DFF3F]">
                <Activity className="w-3.5 h-3.5 text-[#C6FF00]" />
                Simulated Market Online
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#151919] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#FB7185] text-[11px] font-mono text-[#9BA39B] hover:text-[#FB7185] transition-colors cursor-pointer"
                title="Reset local storage and reload sample data"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Data
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F7F2] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link href="/" className="hover:text-[#C6FF00] transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[#C6FF00] transition-colors">
                  Explore Hardware
                </Link>
              </li>
              <li>
                <Link href="/arena" className="hover:text-[#C6FF00] transition-colors">
                  Overclock Arena (Live)
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-[#C6FF00] transition-colors">
                  Market Intelligence
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-[#C6FF00] transition-colors">
                  Saved Watchlist
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C6FF00] transition-colors">
                  About & Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Component Categories */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F7F2] mb-4">
              Hardware
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link href="/explore?category=Graphics+Cards" className="hover:text-[#C6FF00] transition-colors">
                  Graphics Cards (RTX / RX)
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Processors" className="hover:text-[#C6FF00] transition-colors">
                  Processors (Ryzen / Core)
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Memory" className="hover:text-[#C6FF00] transition-colors">
                  DDR5 High-Speed RAM
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Storage" className="hover:text-[#C6FF00] transition-colors">
                  PCIe Gen4/5 NVMe SSDs
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Motherboards" className="hover:text-[#C6FF00] transition-colors">
                  Overclocking Motherboards
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Cooling" className="hover:text-[#C6FF00] transition-colors">
                  Liquid & Air Coolers
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F7F2] mb-4">
              Academic Project
            </h4>
            <div className="space-y-2 text-xs font-mono text-[#68716B]">
              <div className="flex items-center gap-1.5 text-[#9BA39B]">
                <Cpu className="w-3.5 h-3.5 text-[#C6FF00]" />
                <span>Next.js 16 + React 19</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#9BA39B]">
                <Terminal className="w-3.5 h-3.5 text-[#9DFF3F]" />
                <span>Tailwind CSS + Recharts</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#9BA39B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>TypeScript Engine</span>
              </div>
              <p className="pt-2 text-[11px] leading-relaxed">
                Built for advanced web application engineering showcase.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-8 p-4 bg-[#101313] border border-[#29302A] rounded-md text-xs font-mono text-[#9BA39B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <span className="px-2 py-0.5 bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/30 rounded text-[10px] font-bold shrink-0 mt-0.5">
              DEMO NOTICE
            </span>
            <p className="text-[11px] leading-relaxed">
              OVERCLOCK is a university demonstration project. All hardware listings,
              simulated bidders, countdown auctions, and historical market metrics are sample
              data intended for functional prototype evaluation. No actual currency, payment
              gateways, or legal sales contracts are involved.
            </p>
          </div>
          <div className="text-[10px] text-[#68716B] shrink-0 font-mono">
            © 2026 OVERCLOCK. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
