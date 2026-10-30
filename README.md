# OVERCLOCK — Bid Beyond Limits

**OVERCLOCK** is an advanced, production-grade computer hardware bidding and auction marketplace built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Recharts**.

Designed as a university web engineering showcase, the platform simulates a competitive technology hardware exchange combined with a financial-grade market intelligence suite.

---

## ⚡ Key Highlights & Architecture

- **Dark Cybernetic Design System:** High-contrast palette (`#080A0A` background, `#C6FF00` Electric Lime accents, `#151919` card surfaces) with **Space Grotesk** headings, **Inter** body typography, and **IBM Plex Mono** data labels.
- **Simulated Auction Arena:** Live per-second countdown timers, strict minimum bid increment validation, instant leader tracking, confetti celebrations, and simulated competitors (`ByteRunner`, `PixelForge`, `VoltageX`, etc.).
- **7-Visualization Market Intelligence Suite:** In-depth Recharts data engine featuring Price Trends (Line), Auction Velocity (Area), Marketplace Composition (Donut), Bid vs. Market Valuation (Grouped Bar), Competitive Categories (Horizontal Bar), Bid Tier Distribution (Histogram), and a Sortable Telemetry Performance Table.
- **Client Persistence Engine:** Full `localStorage` state management for simulated bids, updated product values, bidder logs, and persistent watchlists.
- **Component Taxonomy:** 20 verified real-world PC components (NVIDIA RTX 4080 Super, RTX 4070 Super, AMD Ryzen 7 7800X3D, Ryzen 9 7950X, Samsung 990 PRO 2TB NVMe, G.Skill Trident Z5 DDR5, ASUS ROG Strix motherboards, etc.) with category-tailored technical specifications.

---

## 🧭 Routes & Pages

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Hero with featured GPU visual, live telemetry snapshot, featured auctions, Arena spotlight, price trend preview, and 3-step workflow. |
| `/explore` | **Explore Hardware** | Marketplace catalog with multi-facet filters (category, price range, condition, manufacturer, ending soon, buy-now), instant search, sorting, and grid/list view modes. |
| `/arena` | **Overclock Arena** | Live bidding floor with active auctions, countdown timers, leading indicator ribbons, and simulated bidding modals. |
| `/product/[id]` | **Product Details** | Dynamic route for each hardware component with multi-angle gallery, category-tailored specs, interactive bidding panel, historical price line chart, bid history log, and similar listings. |
| `/analytics` | **Market Intelligence** | Analytics suite with 6 KPIs, 7 interactive visualizations, date/category/brand filters, dynamic data-driven observations, and a sortable performance table. |
| `/watchlist` | **Watchlist** | Bookmarked listings with live countdowns, quick bidding, sorting, clear confirmation, and synchronized navbar counter. |
| `/about` | **About Overclock** | Platform philosophy, 5-step operational lifecycle, architectural differentiators, and academic project simulation disclaimers. |
| `/*` | **404 Page** | Cybernetic "Signal Terminated" not-found page with quick navigation back to safety. |

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (Turbopack, App Router, Server & Client Components)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/) (Strict type checking)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Visualizations:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Celebration Effects:** [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Fonts:** Space Grotesk, Inter, IBM Plex Mono (via `next/font/google`)
- **State & Storage:** React Context API + Browser `localStorage`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v18.18+` or `v20+` (tested on Node `v26.13.0`)
- npm `v9+` or `v10+`

### 2. Installation
```bash
npm install
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Start
```bash
npm run build
npm run start
```
Or start on a custom port:
```bash
PORT=3005 npm run start
```

### 5. Linting & Validation
```bash
npm run lint
```

---

## ⚠️ Academic Demonstration Disclaimer

OVERCLOCK is developed strictly as a university web application engineering project. All hardware components, simulated competitors, placed bids, countdown timers, and market price movements are simulated demonstration data. No real financial payments, banking interfaces, or commercial transactions are executed.
# Overclock
