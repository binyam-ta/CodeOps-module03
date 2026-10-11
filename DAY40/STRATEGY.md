## Route Overview & Production Build Signatures

From Next.js `16.2.10` production build output:

```text
Route (app)           Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dishes
├ ƒ /api/orders
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                     1h      1y
└ ● /menu/[id]
  ├ /menu/1
  ├ /menu/buna
  ├ /menu/2
  └ [+15 more paths]

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

## Route-by-Route Breakdown

### 1. `/` — Home Page
* **Rendering Strategy**: Static Pre-rendering (`○ Static`)
* **Producing File**: [`app/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/page.js)
* **Rationale**:
  The homepage contains brand identity, cultural Buna ceremony storytelling, feature spotlights, and today's featured chef specials. Because this content is consistent across all visitors and does not depend on request-time user credentials or URL search queries, generating static HTML at build time provides optimal Time to First Byte (TTFB), zero server execution overhead, and seamless CDN edge caching.
* **Revalidation Interval**: Built at compile-time; pre-rendered statically.
* **Verification**:
  Build output marks `/` with `○ (Static) prerendered as static content`. HTML and JSON manifests are emitted directly into `.next/server/app/index.html`.

---

### 2. `/menu` — Menu & Catalog Page
* **Rendering Strategy**: Incremental Static Regeneration (`○ Static` with ISR, Revalidate: `1h` / 3600 seconds)
* **Producing File**: [`app/menu/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/menu/page.js)
* **Rationale**:
  The menu catalog changes infrequently (e.g., when prices or seasonal offerings update), but should not require a full redeployment of the application whenever a kitchen update occurs. Using ISR ensures lightning-fast static page delivery for customers while Next.js automatically refreshes the cached page in the background once the 3600-second window has expired.
  * *Server/Client Separation*: The menu data is retrieved directly from the server-side data access layer [`lib/dishes.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/lib/dishes.js) inside an asynchronous Server Component. Client-side category filtering and search query execution take place on the client inside [`components/MenuClient.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/MenuClient.jsx), avoiding unneeded server recompilations.
* **Revalidation Interval**: `export const revalidate = 3600;` (1 hour).
* **Verification**:
  Next.js build logs explicitly show:
  ```text
  ├ ○ /menu                     1h      1y
  ```
  verifying static generation combined with 1-hour ISR revalidation.

---

### 3. `/menu/[id]` — Dynamic Dish Details Page
* **Rendering Strategy**: Static Site Generation with Static Params (`● SSG`)
* **Producing File**: [`app/menu/[id]/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/menu/[id]/page.js)
* **Rationale**:
  Dish detail pages (such as `/menu/kitfo`, `/menu/doro-wat`, `/menu/1`) have fixed URLs for known dishes. Utilizing `generateStaticParams()` allows Next.js to pre-render every known dish ID and slug into static HTML at build time. When an invalid or nonexistent dish is requested (e.g., `/menu/unknown-item`), the server component triggers `notFound()`, cleanly rendering the custom 404 boundary.
* **Revalidation Interval**: Pre-rendered at build time; on-demand fallback handling for unexpected slugs.
* **Verification**:
  Build logs denote `/menu/[id]` with `● (SSG)` and list pre-rendered static routes:
  ```text
  └ ● /menu/[id]
    ├ /menu/1
    ├ /menu/buna
    ├ /menu/2
    └ [+15 more paths]
  ```

---

### 4. `/cart` — Shopping Cart
* **Rendering Strategy**: Static Pre-rendering Shell (`○ Static`)
* **Producing File**: [`app/cart/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/cart/page.js)
* **Rationale**:
  Cart items and quantities are client-specific state stored locally in browser `localStorage` and managed by React context (`CartContext`). The route shell itself contains no user-specific secrets or server-side session dependencies, allowing the HTML framework to be served statically while client hydration instantly reads and displays the visitor's local items, quantity selectors, 15% Ethiopian tax, and ETB running totals.
* **Revalidation Interval**: Static pre-rendering (`○`).
* **Verification**:
  Build output displays `├ ○ /cart` as static.

---

### 5. `/checkout` — TeleBirr Checkout & Order Placement
* **Rendering Strategy**: Dynamic Server-Rendered on Demand (`ƒ Dynamic`)
* **Producing File**: [`app/checkout/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/checkout/page.js)
* **Rationale**:
  The checkout route handles sensitive customer transactions, live order submission via TeleBirr, server-side data validation, and order processing through Server Actions ([`app/actions.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/actions.js)). Enforcing dynamic rendering (`export const dynamic = 'force-dynamic'`) prevents any caching of checkout states and guarantees fresh server-side evaluation for every transaction request.
* **Revalidation Interval**: None (Dynamic `ƒ`, evaluated on demand for every request).
* **Verification**:
  Build output clearly displays `├ ƒ /checkout` with the dynamic marker `ƒ`.

---

### 6. API Route Handlers
* **`/api/dishes` (`GET`)**: Dynamic route handler (`ƒ Dynamic`) serving fresh dish listings, supporting query parameter filtering (`?category=...&search=...`).
* **`/api/orders` (`POST`)**: Dynamic route handler (`ƒ Dynamic`) receiving JSON orders, verifying dishes and prices from authoritative server data, enforcing Ethiopian phone validation (returning HTTP `422` on errors, HTTP `404` for invalid dishes), and returning HTTP `201 Created` upon persistence.
