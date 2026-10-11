# Server vs. Client Component Boundaries in Addis Eats

In accordance with Next.js App Router best practices, Addis Eats adopts a **Server Components by default** philosophy. `"use client"` is applied only at the leaf or smallest appropriate interactive boundary to minimize client JavaScript bundle size, improve First Contentful Paint (FCP), and maintain a clear security boundary for data access and validation.

---

## Component Boundary Table

| Component | Path | Classification | Directive | Primary Reason / Rationale |
|---|---|---|---|---|
| **Root Layout** | [`app/layout.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/layout.js) | Server Component | *None (Default)* | Renders outer document shell (`<html>`, `<body>`), meta tags, and wraps children without needing client hooks. |
| **Home Page** | [`app/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/page.js) | Server Component | *None (Default)* | Asynchronously fetches today's specials directly from [`lib/dishes.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/lib/dishes.js) on the server. Zero client JS required for static landing presentation. |
| **Today's Specials** | [`components/TodaySpecials.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/TodaySpecials.jsx) | Server Component | *None (Default)* | Pure presentational component rendering server-fetched specials with semantic markup and `next/link`. |
| **Hero** | [`components/Hero.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/Hero.jsx) | Server Component | *None (Default)* | Static marketing banner and navigation links; requires no browser event handlers or state. |
| **Footer** | [`components/Footer.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/Footer.jsx) | Server Component | *None (Default)* | Static site footer with location, copyright, and brand information. |
| **Card** | [`components/Card.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/Card.jsx) | Server Component | *None (Default)* | Reusable presentational card container with CSS styling wrappers. |
| **Menu Layout** | [`app/menu/layout.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/menu/layout.js) | Server Component | *None (Default)* | Layout wrapper providing segment metadata and layout consistency. |
| **Menu Page** | [`app/menu/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/menu/page.js) | Server Component | *None (Default)* | Asynchronous Server Component fetching dish catalog from [`lib/dishes.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/lib/dishes.js) with ISR (`revalidate = 3600`). Avoids unnecessary internal API HTTP roundtrips. |
| **Menu Loading** | [`app/menu/loading.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/menu/loading.js) | Server Component | *None (Default)* | Streaming Suspense fallback rendering spinner and accessibility live region during segment transitions. |
| **Menu Error Boundary** | [`app/menu/error.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/menu/error.js) | Client Component | `"use client"` | Next.js requirement: error boundaries must be Client Components to execute interactive recovery via `reset()` and catch runtime rendering errors. |
| **Dish Details Page** | [`app/menu/[id]/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/menu/[id]/page.js) | Server Component | *None (Default)* | Pre-renders known dish routes via `generateStaticParams()`, fetches single dish by ID/slug, and triggers `notFound()` for missing records. |
| **Checkout Page** | [`app/checkout/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/checkout/page.js) | Server Component | *None (Default)* | Configured with `export const dynamic = 'force-dynamic'` to prevent caching of order placement route. Delegates client cart rendering to `CheckoutClient`. |
| **Not Found Page** | [`app/not-found.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/not-found.js) | Server Component | *None (Default)* | Global 404 page rendered when unknown routes or `notFound()` are reached. |
| **Header** | [`components/Header.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/Header.jsx) | Client Component | `"use client"` | Uses `usePathname()` for active link indicators, `useCart()` for real-time badge counters, and `useAuth()` for user profile toggle. |
| **Providers** | [`components/Providers.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/Providers.jsx) | Client Component | `"use client"` | Houses React Context Providers (`CartProvider`, `AuthProvider`) which rely on React Context and browser storage. |
| **Category Bar** | [`components/CategoryBar.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/CategoryBar.jsx) | Client Component | *Presentational* | Handles button clicks (`onClick`), active tab styling, and category selection events inside `MenuClient`. |
| **Dish Component** | [`components/Dish.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/Dish.jsx) | Client Component | *Presentational* | Contains the interactive `+ Add` button with `onAdd` callback to dispatch items to the cart context. |
| **Dish List** | [`components/DishList.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/DishList.jsx) | Client Component | *Presentational* | Maps through filtered dishes and passes item selection handlers to individual cards. |
| **Menu Client** | [`components/MenuClient.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/MenuClient.jsx) | Client Component | `"use client"` | Manages client-side search input state, category filtering chips, sticky cart shortcut bar, and cart addition events. |
| **Dish Detail View** | [`components/DishDetail.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/DishDetail.jsx) | Client Component | `"use client"` | Features interactive quantity increments (`+` / `−`), `addToCart()` action dispatch, and transient "Added to cart!" UI notifications. |
| **Cart Page** | [`app/cart/page.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/cart/page.js) | Client Component | `"use client"` | Reads and mutates client cart state (`updateQuantity`, `removeFromCart`, `clearCart`), computes ETB totals, and reads `localStorage`. |
| **Checkout Client** | [`components/CheckoutClient.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/CheckoutClient.jsx) | Client Component | `"use client"` | Bridges client-side cart data to the checkout form and displays line-item summary. |
| **Order Form** | [`components/OrderForm.jsx`](file:///c:/Users/Administrator/Music/mo3/DAY40/components/OrderForm.jsx) | Client Component | `"use client"` | Provides client-side validation feedback, manages touched states, invokes `placeOrder` Server Action via `useActionState()`, and displays confirmed order receipt. |

---

## Architectural Principles Applied

1. **Direct Data Access in Server Components**:
   `app/menu/page.js` and `app/page.js` import [`lib/dishes.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/lib/dishes.js) directly without executing an unnecessary `fetch("http://localhost:3000/api/dishes")` loopback.
2. **Smallest Interactive Boundaries**:
   Pages like `app/menu/page.js` and `app/checkout/page.js` remain Server Components. `"use client"` is isolated to interactive child components like `MenuClient.jsx` and `CheckoutClient.jsx`.
3. **Data Security & Secret Protection**:
   Order processing and price calculations are strictly executed on the server in [`app/actions.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/actions.js) and [`app/api/orders/route.js`](file:///c:/Users/Administrator/Music/mo3/DAY40/app/api/orders/route.js). Client-submitted prices are discarded and replaced with authoritative server catalog rates.
