# Aatu Zhatu (आतु-झाटु) • Smart Shopping • Simple Life

[![Status](https://img.shields.io/badge/Status-Industry--Ready-brightgreen)](https://github.com/Kartik46-Parvatia/Aatu-Zhatu-website)
[![Node](https://img.shields.io/badge/Node.js-v24-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.2-blue)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-18-cyan)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-purple)](https://vitejs.dev)

A complete, production-grade, full-stack eCommerce web platform built around the quirky, memorable concept of **Aatu Zhatu** — your everyday destination for smart lifestyle electronics, trendsetting apparel, and modern home decor with honest Indian pricing and express dispatch.

---

## 💡 Concept & Core Influence

The brand name **Aatu Zhatu** captures the quintessential Indian sentiment of finding *"everything you need, all in one place"*:
- **Tagline**: `SMART SHOPPING • SIMPLE LIFE`
- **Visual Identity**: High-contrast, sleek cyber-dark aesthetic (`#0d1117`) illuminated by energetic neon-emerald accents (`#39d353`).
- **Core Value Pillars**:
  1. 🚚 **Fast Delivery**: Doorstep dispatch across 19,000+ Indian PIN codes (Free above ₹499).
  2. 🔒 **100% Secure Checkout**: Multi-gateway support (Dynamic UPI QR, Cards with type detection, Verified COD).
  3. ↩ **7-Day Easy Returns**: Transparent, hassle-free replacements and refunds.
  4. ⚡ **Smart Everyday Curations**: Verified products with genuine customer feedback.

---

## 🚀 Key Features

### 🛍️ 1. Interactive Product Catalog
- **Category Filter Pills**: Quick toggle across `All`, `Technology ⌚`, `Fashion 👟`, and `Home & Living 💡`.
- **Real-Time Live Search**: Debounced instant keyword searching across titles, tags, and product descriptions.
- **Dynamic Sorting**: Filter by *Featured*, *Price: Low to High*, *Price: High to Low*, *Top Rated*, and *Most Reviewed*.
- **Stock Warnings**: Auto-detects low inventory (`< 15 units`) with real-time warning indicators.

### 🔍 2. Product Quick View & Customer Reviews
- **Detail Modal**: View HD images, specifications, warranty information, and key highlights.
- **Interactive Review Engine**: Read real buyer feedback and submit your own ratings (1 to 5 stars) + reviews with immediate persistence to the backend database (`POST /api/products/:id/reviews`).

### 🛒 3. Slide-Over Cart & Coupon Engine
- **Free Shipping Meter**: Interactive progress bar dynamically showing how many rupees are needed to unlock free shipping (`₹499 threshold`).
- **Coupon System**: Live validation (`POST /api/coupons/apply`) with instant discount deductions:
  - `AATU20`: 20% OFF on orders over ₹499 (up to ₹500 discount)
  - `ZHATU50`: Flat ₹50 OFF on orders over ₹299
  - `WELCOME100`: Flat ₹100 OFF on orders over ₹699
  - `FREESHIP`: 100% discount on shipping fees
- **Taxes & Totals**: Accurate automatic computation of subtotal, discounts, shipping, and 5% GST.

### 💳 4. Production-Grade Checkout (Modern Web Guidance Compliant)
- **Autofill Optimized**: Native `autocomplete`, `inputmode="numeric"`, and pattern validation for rapid checkout.
- **Indian PIN Code Auto-Lookup**: Typing a 6-digit PIN code (e.g. `380009` or `400001`) automatically suggests City and State.
- **Payment Modes**:
  1. 📱 **Instant Dynamic UPI / QR**: Generates an interactive mock UPI QR code with a 5-minute countdown timer and VPA field.
  2. 💳 **Credit / Debit Cards**: Automatic card brand detection (Visa, Mastercard, RuPay, Amex), space formatting, and format hints (`MM/YY`) positioned above inputs per web best practices.
  3. 📦 **Cash on Delivery (COD)**: Verified doorstep cash settlement with zero advance fee.

### 📦 5. Real-Time Order Tracking Timeline
- **Order ID System**: Clean human-readable IDs (e.g. `AZ-10492` or newly placed orders).
- **Interactive Milestone Stepper**:
  - `Placed & Verified` ➔ `Packed at Hub` ➔ `Dispatched via Express Courier` ➔ `Out for Delivery` ➔ `Delivered`
- Displays recipient information, courier assignment, timestamps, and itemized receipts.

### 📊 6. Store Management / Admin Hub
- **Executive KPIs**: Real-time revenue gross, total order count, average order value (AOV), and low-stock count.
- **Order Status Control**: Admin dropdown to transition orders between `placed`, `processing`, `shipped`, `out_for_delivery`, and `delivered` via `PATCH /api/orders/:id/status`.
- **Inventory Replenishment**: Adjust product stock on the fly (`+5`, `−1`) or add new items via modal.

### 🏛️ 7. Full Legacy Preservation
- Original static HTML prototype is fully preserved and hosted at `/legacy/landing.html`.

---

## 🛠️ Tech Stack & Architecture

```
Aatu-Zhatu-website/
├── server/
│   ├── server.js              # Express 5 server (API, SPA fallback & static routing)
│   ├── database.js            # Persistent JSON document store & CRUD engine
│   ├── routes/
│   │   └── api.js             # REST endpoints (products, orders, coupons, admin)
│   └── data/
│       ├── products.js        # Seed catalog data (12 rich products with HD images)
│       └── db.json            # Auto-generated persistent runtime database
├── client/
│   ├── index.html             # HTML5 entry with Google Fonts & custom AZ SVG favicon
│   ├── vite.config.js         # Vite configuration with API dev proxy
│   ├── src/
│   │   ├── main.jsx           # React DOM root
│   │   ├── App.jsx            # State coordinator, view router, modals & notifications
│   │   ├── index.css          # Cyber-emerald design system, animations, responsive grid
│   │   └── components/
│   │       ├── Navbar.jsx            # Sticky header with ticker, tabs & cart counter
│   │       ├── Hero.jsx              # Hero banner with deal-of-the-day card
│   │       ├── FeaturesStrip.jsx     # Value props & guarantees strip
│   │       ├── ProductCard.jsx       # Card with image fallback, badges & discount tag
│   │       ├── ProductQuickView.jsx  # Detailed modal with specs & review form
│   │       ├── CartDrawer.jsx        # Slide-over cart with free delivery tracker
│   │       ├── CheckoutView.jsx      # Multi-method checkout with UPI QR & card detection
│   │       ├── OrderSuccessModal.jsx # Confetti blast, order summary & print receipt
│   │       ├── OrderTrackerView.jsx  # 5-step courier delivery milestone tracker
│   │       ├── AdminDashboard.jsx    # Store management, orders table & stock adjuster
│   │       ├── WishlistModal.jsx     # Saved favorites manager
│   │       └── Toast.jsx             # Non-intrusive toast notifications
├── package.json               # Root scripts & server dependencies
└── test-server.js             # Automated end-to-end integration test runner
```

---

## 🚦 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 2. Run the Full-Stack Application
From the project root:
```bash
# Start production full-stack server on port 5000:
npm start
```
Open your browser and navigate to:
👉 **http://localhost:5000**

### 3. Run in Development Mode (with hot-reload)
```bash
# Terminal 1: Start Express backend
npm run server

# Terminal 2: Start Vite React dev server
npm run client
```
Access the Vite dev server at **http://localhost:3000** (API calls are automatically proxied to port 5000).

### 4. Build Production Assets
```bash
npm run build
```

### 5. Run Automated End-to-End Tests
```bash
node test-server.js
```
Runs integration tests covering API health, catalog retrieval, promo coupon calculations, order placement, order tracking milestones, and admin stats.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service healthcheck & version |
| `GET` | `/api/products` | Retrieve catalog with `search`, `category`, `sort`, `minPrice`, `maxPrice` |
| `GET` | `/api/products/:id` | Get product details, specs, reviews, and related items |
| `POST` | `/api/products/:id/reviews` | Submit a customer rating and review |
| `POST` | `/api/coupons/apply` | Validate coupon code and calculate discount amount |
| `POST` | `/api/orders` | Place a new order with items, shipping details, and payment mode |
| `GET` | `/api/orders` | List all orders |
| `GET` | `/api/orders/:id` | Retrieve an order by tracking ID with milestone timeline |
| `PATCH` | `/api/orders/:id/status` | Update fulfillment status (`placed`, `processing`, `shipped`, `out_for_delivery`, `delivered`) |
| `GET` | `/api/admin/stats` | Store analytics (revenue, order counts, AOV, low stock alerts) |
| `POST` | `/api/admin/products` | Create a new catalog item |
| `PUT` | `/api/admin/products/:id` | Update product details or stock quantity |
| `DELETE` | `/api/admin/products/:id` | Delete product from catalog |
| `GET` | `/legacy/landing.html` | Access the original static HTML prototype |

---

## 👤 Author & Acknowledgements
- **Author**: Kartik Parvatia
- **Brand**: Aatu Zhatu
- **Design Philosophy**: High utility, high contrast, blazing fast responsive eCommerce.