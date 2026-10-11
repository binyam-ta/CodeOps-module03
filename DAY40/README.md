# Addis Eats — Next.js App Router Application

A modern, responsive Ethiopian food ordering and TeleBirr delivery web application built with the **Next.js App Router** (`app/`), React 19, and Tailwind CSS. The application demonstrates authentic Ethiopian dining traditions, server-side data integrity, Incremental Static Regeneration (ISR), static pre-rendering with `generateStaticParams()`, secure Server Actions, and strict separation between Server and Client Components.

---

## Architecture & Route Table

Every route is organized under the Next.js App Router folder structure and adheres to explicit rendering strategies:

| Route Path | Producing File | Strategy & Build Marker | Description |
|---|---|---|---|
| `/` | [`app/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/page.js) | Static (`○`) | **Home Page** — Addis Eats landing page displaying brand story, Buna ceremony showcase, and server-rendered Today's Specials. |
| `/menu` | [`app/menu/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/menu/page.js) | Static with ISR (`○`, 1h) | **Menu Page** — Asynchronous Server Component fetching dish catalog with 3600s ISR revalidation. Interactive category filtering and search scoped to client components. |
| `/menu/[id]` | [`app/menu/[id]/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/menu/[id]/page.js) | Static (`● SSG`) | **Dynamic Dish Details** — Pre-renders all known dishes at build time using `generateStaticParams()`. Triggers `notFound()` for invalid IDs. |
| `/cart` | [`app/cart/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/cart/page.js) | Static Shell (`○`) | **Cart Page** — Interactive shopping cart displaying selected items, quantity controls, 15% Ethiopian tax, and running total in ETB. |
| `/checkout` | [`app/checkout/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/checkout/page.js) | Dynamic (`ƒ`) | **TeleBirr Checkout** — Forced dynamic rendering (`export const dynamic = 'force-dynamic'`), Server Action order placement (`placeOrder`), and server-side validation. |
| *Catch-All / 404* | [`app/not-found.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/not-found.js) | Static (`○`) | **404 Not Found** — Accessible error page for unknown URLs and programmatic `notFound()` invocations. |
| `/api/dishes` | [`app/api/dishes/route.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/api/dishes/route.js) | Dynamic Route (`ƒ`) | **Dishes API (GET)** — Public HTTP endpoint supporting category and keyword filtering. |
| `/api/orders` | [`app/api/orders/route.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/api/orders/route.js) | Dynamic Route (`ƒ`) | **Orders API (POST)** — Validates order fields, recalculates totals on server authority, enforces Ethiopian phone regex, returning `201`, `404`, or `422`. |

---

## Production Build Verification

Executed with `npm run build`:

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

## Project Structure

```
├── app/
│   ├── actions.js              # Server Action: placeOrder with input validation & server pricing
│   ├── globals.css             # Global styles, variables, typography, and responsive layout
│   ├── layout.js               # Root layout with Header, Footer, and Context Providers
│   ├── not-found.js            # Custom 404 UI for bad URLs & notFound()
│   ├── page.js                 # Static homepage with Today's Specials (Server Component)
│   ├── api/
│   │   ├── dishes/
│   │   │   └── route.js        # GET endpoint for dishes
│   │   └── orders/
│   │       └── route.js        # POST endpoint with validation (201, 404, 422, 500)
│   ├── cart/
│   │   └── page.js             # Interactive client cart page with ETB totals
│   ├── checkout/
│   │   └── page.js             # Dynamic checkout route (force-dynamic)
│   └── menu/
│       ├── layout.js           # Menu layout wrapper and metadata
│       ├── page.js             # Menu Server Component with ISR (revalidate = 3600)
│       ├── loading.js          # Suspense loading state for the menu segment
│       ├── error.js            # Client error boundary ("use client") for menu errors
│       └── [id]/
│           └── page.js         # Dynamic route with generateStaticParams() and notFound()
├── components/
│   ├── Card.jsx                # Presentational card container (Server Component)
│   ├── CategoryBar.jsx         # Interactive category filter chips
│   ├── CheckoutClient.jsx      # Client wrapper for cart data on checkout
│   ├── Dish.jsx                # Individual dish card
│   ├── DishDetail.jsx          # Dish detail view with quantity controls and cart dispatch
│   ├── DishList.jsx            # Grid of dish cards
│   ├── Footer.jsx              # Site footer (Server Component)
│   ├── Header.jsx              # Navigation header with active links & live cart count
│   ├── Hero.jsx                # Landing hero banner (Server Component)
│   ├── MenuClient.jsx          # Menu client component with search & category filters
│   ├── OrderForm.jsx           # TeleBirr checkout form using useActionState
│   ├── Providers.jsx           # Root client context wrapper (CartProvider, AuthProvider)
│   └── TodaySpecials.jsx       # Chef's specials showcase (Server Component)
├── context/
│   ├── AuthContext.tsx         # User authentication state
│   └── CartContext.tsx         # Shopping cart state & localStorage persistence
├── lib/
│   ├── dishes.js               # Centralized dish catalog & server data access functions
│   └── orders.js               # Order validation rules & development persistence store
├── BOUNDARY.md                 # Detailed Server vs Client component classifications
├── STRATEGY.md                 # Route rendering strategies & build proof
└── README.md
```

---

## Architectural Highlights

1. **Server Components by Default**:
   Data access occurs directly in Server Components via [`lib/dishes.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/lib/dishes.js). There are no unnecessary network loopbacks fetching internal API endpoints on the server.
2. **Incremental Static Regeneration (ISR)**:
   `/menu` generates static HTML served instantly from cache, automatically revalidating every 3600 seconds (1 hour). Category filtering and search happen client-side in [`components/MenuClient.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/MenuClient.jsx).
3. **Static Pre-Rendering with `generateStaticParams()`**:
   All known dish IDs and slugs are evaluated at compile time in `app/menu/[id]/page.js`. Requesting an unknown dish ID invokes `notFound()`, returning HTTP 404 with custom branded UI.
4. **Authoritative Pricing & Server-Side Security**:
   The `placeOrder` Server Action and the `/api/orders` route handler never trust client-submitted prices or totals. Prices and taxes (15%) are re-computed authoritatively on the server from the menu database.
5. **Progressive Enhancement**:
   `OrderForm.jsx` leverages React 19's `useActionState(placeOrder)` and native HTML form submission structures, ensuring reliable order submission with field-level validation feedback.

---

## How to Install, Build, and Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

### 3. Start Production Server
```bash
npm run start
# Server listens on http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

---

## Verification & Endpoint Testing via `curl`

### 1. Test Static Homepage
```bash
curl -i http://localhost:3000/
# HTTP/1.1 200 OK — contains Addis Eats branding and Today's Specials
```

### 2. Test ISR Menu Route
```bash
curl -i http://localhost:3000/menu
# HTTP/1.1 200 OK — statically served with 1h ISR cache metadata
```

### 3. Test Dynamic Dish Detail
```bash
curl -i http://localhost:3000/menu/kitfo
# HTTP/1.1 200 OK — renders Kitfo dish details
```

### 4. Test 404 for Nonexistent Dish
```bash
curl -i http://localhost:3000/menu/unknown-dish-999
# HTTP/1.1 404 Not Found — invokes notFound() and displays not-found.js
```

### 5. Test Dishes API
```bash
curl -i http://localhost:3000/api/dishes
# HTTP/1.1 200 OK — returns JSON array of dishes
```

### 6. Test Orders API — Invalid Phone Number (HTTP 422)
```bash
curl -i -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"Abebe Bikila","phone":"12345","area":"Bole","items":[{"id":1,"quantity":2}]}'
# Returns: HTTP/1.1 422 Unprocessable Entity with field error for phone
```

### 7. Test Orders API — Nonexistent Dish ID (HTTP 404)
```bash
curl -i -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"Abebe Bikila","phone":"0911223344","area":"Bole","items":[{"id":99999,"quantity":1}]}'
# Returns: HTTP/1.1 404 Not Found with error message indicating missing dish
```

### 8. Test Orders API — Successful Order Creation (HTTP 201)
```bash
curl -i -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"Abebe Bikila","phone":"0911223344","area":"Bole","items":[{"id":1,"quantity":2},{"id":2,"quantity":1}]}'
# Returns: HTTP/1.1 201 Created with order receipt and recalculation of total in ETB
```
