import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";
import { AuctionProvider } from "@/context/AuctionContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OVERCLOCK | Bid Beyond Limits",
  description:
    "Explore computer hardware auctions, discover premium PC components, track market prices, and analyze competitive hardware marketplace trends with Overclock.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#080A0A] text-[#F5F7F2] font-sans antialiased selection:bg-[#C6FF00] selection:text-[#080A0A] flex flex-col justify-between">
        <AuctionProvider>
          <Suspense fallback={<div className="h-16 bg-[#080A0A]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 pt-20 sm:pt-24">{children}</main>
          <Footer />
        </AuctionProvider>
      </body>
    </html>
  );
}
