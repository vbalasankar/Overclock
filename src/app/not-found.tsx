import React from "react";
import Link from "next/link";
import { AlertTriangle, Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#151919] border border-[#29302A] flex items-center justify-center mx-auto text-[#FB7185]">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono text-[#C6FF00] uppercase tracking-wider">
          404 · HARDWARE NODE NOT FOUND
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F5F7F2]">
          SIGNAL TERMINATED
        </h1>
        <p className="font-mono text-xs sm:text-sm text-[#9BA39B] max-w-md mx-auto">
          The requested coordinate does not exist on the Overclock network. The listing
          may have been delisted or relocated.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-[#151919] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#C6FF00] text-[#F5F7F2] font-mono text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/explore"
          className="px-6 py-3 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all glow-lime-sm flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
}
