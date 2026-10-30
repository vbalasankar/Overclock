"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuction } from "@/context/AuctionContext";
import { GlobalSearchModal } from "./GlobalSearchModal";
import {
  Zap,
  Search,
  Heart,
  Menu,
  X,
  TrendingUp,
  Gavel,
  Compass,
  Info,
  Radio,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { watchlist } = useAuction();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut Cmd+K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Arena", href: "/arena", icon: Gavel, badge: "LIVE" },
    { label: "Market Intelligence", href: "/analytics", icon: TrendingUp },
    { label: "About", href: "/about", icon: Info },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
          scrolled
            ? "bg-[#080A0A]/95 backdrop-blur-md border-[#29302A] py-3 shadow-lg shadow-black/40"
            : "bg-[#080A0A]/80 backdrop-blur-sm border-[#29302A]/60 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded bg-[#151919] border border-[#29302A] group-hover:border-[#C6FF00] flex items-center justify-center transition-colors">
                <Zap className="w-5 h-5 text-[#C6FF00] fill-current group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg sm:text-xl font-extrabold tracking-widest text-[#F5F7F2] flex items-center gap-1">
                  OVERCLOCK
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C6FF00]" />
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#9BA39B] uppercase -mt-1">
                  Bid Beyond Limits
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 rounded text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "text-[#080A0A] bg-[#C6FF00] font-bold shadow-[0_0_15px_-2px_rgba(198,255,0,0.4)]"
                        : "text-[#9BA39B] hover:text-[#F5F7F2] hover:bg-[#151919]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                    {link.badge && !isActive && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C6FF00]/20 text-[#C6FF00] border border-[#C6FF00]/40 flex items-center gap-0.5">
                        <Radio className="w-2.5 h-2.5 animate-pulse text-[#C6FF00]" />
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search, Watchlist, CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#151919] hover:bg-[#1B2020] border border-[#29302A] hover:border-[#C6FF00]/50 rounded text-xs font-mono text-[#9BA39B] transition-colors cursor-pointer"
                aria-label="Search hardware"
              >
                <Search className="w-3.5 h-3.5 text-[#C6FF00]" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-[#101313] border border-[#29302A] rounded text-[#68716B]">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-2 text-[#9BA39B] hover:text-[#F5F7F2] bg-[#151919] border border-[#29302A] rounded cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-[#C6FF00]" />
              </button>

              {/* Watchlist Counter Link */}
              <Link
                href="/watchlist"
                className={`relative p-2 rounded border transition-colors ${
                  pathname === "/watchlist"
                    ? "bg-[#C6FF00]/10 border-[#C6FF00] text-[#C6FF00]"
                    : "bg-[#151919] border-[#29302A] text-[#9BA39B] hover:text-[#F5F7F2] hover:border-[#C6FF00]/40"
                }`}
                title="Watchlist"
                aria-label="Watchlist"
              >
                <Heart className="w-4 h-4" />
                {watchlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C6FF00] text-[#080A0A] font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {watchlist.length}
                  </span>
                )}
              </Link>

              {/* Primary ENTER ARENA Button */}
              <Link
                href="/arena"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-xs uppercase tracking-wider rounded transition-all glow-lime-sm cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>ENTER ARENA</span>
              </Link>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-[#9BA39B] hover:text-[#F5F7F2] bg-[#151919] border border-[#29302A] rounded cursor-pointer"
                aria-label="Open mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#C6FF00]" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#29302A] bg-[#080A0A] px-4 pt-4 pb-6 space-y-3 animate-fade-in">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded font-mono text-sm uppercase tracking-wider ${
                      isActive
                        ? "bg-[#C6FF00] text-[#080A0A] font-bold"
                        : "text-[#9BA39B] hover:text-[#F5F7F2] hover:bg-[#151919]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#101313] text-[#C6FF00] border border-[#29302A]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              <Link
                href="/watchlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded font-mono text-sm uppercase tracking-wider ${
                  pathname === "/watchlist"
                    ? "bg-[#C6FF00] text-[#080A0A] font-bold"
                    : "text-[#9BA39B] hover:text-[#F5F7F2] hover:bg-[#151919]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>Watchlist</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#101313] text-[#F5F7F2] border border-[#29302A]">
                  {watchlist.length} saved
                </span>
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/arena"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 bg-[#C6FF00] hover:bg-[#9DFF3F] text-[#080A0A] font-heading font-bold text-sm uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 shadow-md glow-lime-sm"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>ENTER ARENA NOW</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Overlay */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
