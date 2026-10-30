"use client";

import React from "react";
import Link from "next/link";
import { useAuction } from "@/context/AuctionContext";
import {
  Zap,
  Activity,
  ShieldAlert,
  BarChart3,
  Gavel,
  Cpu,
  Terminal,
  RefreshCw,
} from "lucide-react";

export default function AboutPage() {
  const { resetAllData } = useAuction();

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all local bids, watchlist items, and restore initial sample database?"
      )
    ) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* HERO */}
      <div className="relative bg-[#151919] border border-[#29302A] rounded-xl p-8 sm:p-14 overflow-hidden tech-grid">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#101313] border border-[#29302A] text-xs font-mono text-[#C6FF00]">
            <Zap className="w-3.5 h-3.5" />
            <span>PROJECT: OVERCLOCK · ENGINEERING DOSSIER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#F5F7F2] tracking-tight leading-[1.1]">
            HARDWARE IS THE GAME. <br />
            <span className="text-[#C6FF00]">DATA IS YOUR ADVANTAGE.</span>
          </h1>

          <p className="text-sm sm:text-base font-sans text-[#9BA39B] leading-relaxed">
            Overclock brings computer hardware discovery, competitive simulated auctions,
            and market intelligence into one cohesive digital product. Designed to redefine
            how PC enthusiasts, overclockers, and gamers evaluate and bid on high-performance
            silicon.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/arena"
              className="px-6 py-3 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all glow-lime-sm flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              <span>Enter The Arena</span>
            </Link>
            <Link
              href="/analytics"
              className="px-6 py-3 bg-[#101313] hover:bg-[#1B2020] border border-[#29302A] text-[#F5F7F2] font-mono text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-[#C6FF00]" />
              <span>Market Intelligence</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 1: OUR CONCEPT */}
      <section className="space-y-6">
        <div className="border-b border-[#29302A] pb-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#C6FF00] mb-1">
            Product Philosophy
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F7F2]">
            OUR CONCEPT
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#9BA39B] leading-relaxed">
          <p>
            Traditional e-commerce platforms treat high-end PC hardware as static inventory
            with fixed price tags. In reality, modern components—such as top-tier Ada Lovelace
            GPUs, 3D V-Cache processors, and high-speed DDR5 memory—exist within volatile supply
            and demand dynamics influenced by gaming releases, AI compute booms, and collector demand.
          </p>
          <p>
            <strong>OVERCLOCK</strong> transforms hardware acquisition into an active, data-driven
            bidding arena. Users do not merely browse products; they analyze price movements,
            compete in simulated real-time auctions, track bidder velocity, and time their moves
            to acquire hardware at optimal value.
          </p>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section className="space-y-6">
        <div className="border-b border-[#29302A] pb-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#C6FF00] mb-1">
            Step-By-Step Lifecycle
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F7F2]">
            HOW IT WORKS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Discover Components",
              desc: "Filter by architectural generation, core count, VRAM capacity, and condition across verified listings.",
            },
            {
              step: "02",
              title: "Evaluate Listings",
              desc: "Compare current bids against estimated market values to spot listings priced below market rate.",
            },
            {
              step: "03",
              title: "Monitor Activity",
              desc: "Save candidate hardware to your personal Watchlist and track live countdown clocks in real time.",
            },
            {
              step: "04",
              title: "Place Simulated Bids",
              desc: "Submit validated incremental bids in the Overclock Arena and take the lead on the auction board.",
            },
            {
              step: "05",
              title: "Analyze Trends",
              desc: "Cross-reference bidding outcomes with interactive price trend charts in Market Intelligence.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 bg-[#151919] border border-[#29302A] rounded-lg space-y-2 relative"
            >
              <div className="text-xs font-mono font-bold text-[#C6FF00]">
                {item.step}
              </div>
              <h3 className="font-heading font-bold text-sm text-[#F5F7F2]">
                {item.title}
              </h3>
              <p className="text-xs font-mono text-[#9BA39B] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: WHAT MAKES OVERCLOCK DIFFERENT? */}
      <section className="space-y-6">
        <div className="border-b border-[#29302A] pb-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#C6FF00] mb-1">
            System Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F7F2]">
            WHAT MAKES OVERCLOCK DIFFERENT?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-[#151919] border border-[#29302A] rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-[#101313] border border-[#29302A] flex items-center justify-center text-[#C6FF00]">
              <Gavel className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              Competitive Auction Arena
            </h3>
            <p className="text-xs font-mono text-[#9BA39B] leading-relaxed">
              Real-time countdown timers synchronized down to the second, with strict bid
              validation, increment controls, and instant leader tracking.
            </p>
          </div>

          <div className="p-6 bg-[#151919] border border-[#29302A] rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-[#101313] border border-[#29302A] flex items-center justify-center text-[#9DFF3F]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              Interactive Telemetry
            </h3>
            <p className="text-xs font-mono text-[#9BA39B] leading-relaxed">
              Seven rich visualizations powered by Recharts, analyzing price history,
              bidder activity, competition intensity, and inventory composition.
            </p>
          </div>

          <div className="p-6 bg-[#151919] border border-[#29302A] rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-[#101313] border border-[#29302A] flex items-center justify-center text-[#FACC15]">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              Data-Driven Value Indicators
            </h3>
            <p className="text-xs font-mono text-[#9BA39B] leading-relaxed">
              Dynamic visual cues comparing current bids against realistic estimated market
              values, pinpointing listings currently trading below market valuation.
            </p>
          </div>

          <div className="p-6 bg-[#151919] border border-[#29302A] rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-[#101313] border border-[#29302A] flex items-center justify-center text-[#60A5FA]">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              Persistent Client Engine
            </h3>
            <p className="text-xs font-mono text-[#9BA39B] leading-relaxed">
              Robust localStorage synchronization ensuring your watchlist, placed bids,
              and telemetry state survive browser refreshes without server dependency.
            </p>
          </div>

          <div className="p-6 bg-[#151919] border border-[#29302A] rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-[#101313] border border-[#29302A] flex items-center justify-center text-[#4ADE80]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              Accurate Hardware Taxonomy
            </h3>
            <p className="text-xs font-mono text-[#9BA39B] leading-relaxed">
              Real-world PC components with category-accurate technical specifications
              for GPUs, CPUs, NVMe SSDs, DDR5 memory, motherboards, and cooling units.
            </p>
          </div>

          <div className="p-6 bg-[#151919] border border-[#29302A] rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-[#101313] border border-[#29302A] flex items-center justify-center text-[#FB7185]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#F5F7F2]">
              Cybernetic Design System
            </h3>
            <p className="text-xs font-mono text-[#9BA39B] leading-relaxed">
              Industrial aesthetics featuring Space Grotesk headings, IBM Plex Mono data,
              electric lime accents, and high-contrast, accessible layouts.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: DEMONSTRATION DISCLAIMER */}
      <section className="bg-[#101313] border border-[#29302A] rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#FACC15] font-bold uppercase">
          <ShieldAlert className="w-4 h-4" />
          <span>ACADEMIC PROJECT & SIMULATION NOTICE</span>
        </div>

        <p className="text-xs sm:text-sm font-mono text-[#9BA39B] leading-relaxed">
          OVERCLOCK is built as a comprehensive university website development showcase
          demonstrating advanced full-stack engineering, interactive data visualization,
          and digital product design.
        </p>

        <p className="text-xs font-mono text-[#68716B] leading-relaxed">
          All hardware listings, simulated participants (e.g. ByteRunner, PixelForge,
          VoltageX), bids, countdown timers, and market telemetry are simulated sample data.
          No real monetary payments, banking credentials, or commercial transactions are
          processed.
        </p>

        <div className="pt-2 flex items-center gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[#151919] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#FB7185] rounded text-xs font-mono text-[#9BA39B] hover:text-[#FB7185] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Local Simulation Data</span>
          </button>
        </div>
      </section>
    </div>
  );
}
