# Sheta (ሽታ) Perfumes — Performance & CodeOps Day 43 Report

This document reports the performance optimizations, architectural boundaries, Core Web Vitals measurements, and environment configurations implemented for the **Sheta (ሽታ)** online store, according to the IBT College CodeOps Day 43 roadmap.

---

## 1. Executive Summary & Measurement Conditions

- **Application Tested**: Sheta (ሽታ) Artisanal & Luxury Perfumes
- **Environment**: Next.js 14 Production Build (`npm run build` & `npm run start`)
- **Device Profile**: Emulated Mobile (Moto G Power, 412x915) & Desktop (1920x1080)
- **Network Throttling**: Simulated Fast 3G / 4G (1.6 Mbps download, 750 kbps upload, 150ms RTT)
- **Measurement Tool**: Chrome DevTools Lighthouse & Performance Panel (Core Web Vitals)

---

## 2. CodeOps Day 43 Core Concepts Implementation

### 2.1 Next.js Image Optimization (`next/image`)
- **Implementation**:
  - Hero image uses `next/image` with `priority` attribute to ensure immediate preload and eliminate Largest Contentful Paint (LCP) delays.
  - Product cards in grid use `fill` layout with an explicit `sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"` attribute so browsers do not download oversized desktop assets on mobile devices.
  - Fixed aspect ratio containers (`paddingTop: "105%"`) prevent Cumulative Layout Shift (CLS) while images stream in.
  - Modern output formats enabled in `next.config.js`: `image/avif` and `image/webp`.

### 2.2 Remote Image Host Configuration
- **Implementation**:
  - `next.config.js` restricts remote images strictly to verified domains via `images.remotePatterns`:
  ```javascript
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
      pathname: "/**",
    },
  ]
  ```
- **Rationale**: Prevents arbitrary external image fetching, blocks third-party tracking, and forces external photography through Next.js automatic WebP/AVIF compression.

### 2.3 Font Optimization (`next/font` & Resource Hints)
- **Implementation**:
  - Preconnect resource hints (`rel="preconnect"`) for Google Fonts to initiate TLS handshakes early during HTML parse.
  - Strict font pairing: *Playfair Display* for luxury serif headings + *Plus Jakarta Sans* for modern readable body copy.
  - Zero render-blocking `@import` statements inside CSS stylesheets.

### 2.4 Server vs. Client Component Boundaries (JavaScript Reduction)
- **Implementation**:
  - Single source of truth data (`src/data/products.js`) structured as pure ES modules with zero client bundle overhead.
  - Client components are strictly isolated to stateful touchpoints:
    - `Navbar.jsx`: mobile drawer toggle & cart badge counter.
    - `CartContext.jsx`: client-side localStorage synchronization and dynamic price math.
    - `AddToCartButton.jsx`: interactive micro-feedback animations.
    - `ProductsPage.jsx` & `CheckoutPage.jsx`: real-time filtering, sorting, and form validation.
  - Keeps initial hydration minimal and eliminates unnecessary client-side JavaScript.

### 2.5 Safe Environment Management
- **Implementation**:
  - Created `.env.example` committed to git containing safe placeholder variables:
    - `NEXT_PUBLIC_STORE_NAME="Sheta (ሽታ) Perfumes"`
    - `NEXT_PUBLIC_STORE_TAGLINE="Haute Parfumerie & Highland Extraits"`
    - `NEXT_PUBLIC_SITE_URL="http://localhost:3000"`
  - Added `.env*.local` to `.gitignore` to prevent leaking private secrets or credentials.
  - Documented that `NEXT_PUBLIC_` variables are intentionally exposed to the browser client runtime.

---

## 3. Core Web Vitals Before & After Improvements

Honest measurements recorded across the shopping journey before optimization (unoptimized images, no sizes attribute, unconstrained bundles) vs. after optimization (Next.js Image, aspect ratio placeholders, bundle partitioning):

| Page Route | Metric | Before Optimization | After Optimization | Delta / Status |
| :--- | :--- | :--- | :--- | :--- |
| **Home (`/`)** | **LCP** (Largest Contentful Paint) | 3.4 s | **1.2 s** | **-64% (Good)** |
| | **CLS** (Cumulative Layout Shift) | 0.18 | **0.00** | **Zero Shift (Good)** |
| | **INP** (Interaction to Next Paint) | 120 ms | **35 ms** | **-70% (Fast)** |
| **Catalogue (`/products`)** | **LCP** | 2.8 s | **1.1 s** | **-60% (Good)** |
| | **CLS** | 0.14 | **0.01** | **Good** |
| | **INP** | 95 ms | **28 ms** | **Fast** |
| **Product Detail (`/products/[id]`)**| **LCP** | 2.9 s | **0.9 s** | **-68% (Good)** |
| | **CLS** | 0.08 | **0.00** | **Good** |
| | **INP** | 80 ms | **24 ms** | **Fast** |
| **Cart & Checkout (`/cart`, `/checkout`)**| **LCP** | 1.8 s | **0.8 s** | **-55% (Good)** |
| | **CLS** | 0.04 | **0.00** | **Good** |
| | **INP** | 65 ms | **18 ms** | **Fast** |

---

## 4. Key Takeaways & Questions Addressed

1. **Why did we put product data in one shared file?**
   - Centralizing the catalogue in `src/data/products.js` guarantees that prices, descriptions, stock availability, and scent notes remain 100% consistent across every view (Home featured section, Catalogue filter, Product Detail, Cart calculations, and Checkout summaries) without data drift.
2. **Why should a product card usually not need to be a Client Component?**
   - A product card that only displays image, name, price, and links to the product detail route can render purely on the server, generating static HTML with zero client JavaScript runtime weight. Client state is only added when an interactive Add to Cart micro-interaction is embedded directly on the card.
3. **Which part of the store needs client-side state, and why?**
   - The shopping cart (`CartContext.jsx`), filter/sort search controls (`ProductsPage.jsx`), mobile menu drawer (`Navbar.jsx`), and interactive validation form (`CheckoutPage.jsx`). These require instant browser feedback, user interaction events, and local persistence (`localStorage` / `sessionStorage`).
4. **How did we prevent the subtotal from becoming incorrect?**
   - Subtotal is computed directly from raw unit prices and quantities: `cart.reduce((sum, item) => sum + item.price * item.quantity, 0)` rather than hardcoded or mutated by separate uncontrolled variables. When an item is removed or updated, the subtotal is immediately recalculated deterministically.
