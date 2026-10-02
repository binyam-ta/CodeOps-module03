# Addis Café (Addis Eats) — Next.js App Router Application

A modern Ethiopian café and TeleBirr delivery web application migrated from Vite + React Router to the Next.js App Router (`app/`). The entire routing hierarchy is built directly from the folder structure, where components move across seamlessly and routing logic disappears into the file system.

---

## Route Table & Producing Files

Every route in the application is represented by a dedicated folder containing a default-exported `page.js`.

| Route Path | Producing File | Route Type | Description |
|---|---|---|---|
| `/` | `app/page.js` | Static (`○`) | **Home Page** — Landing view with Hero, authentic Ethiopian Buna ceremony highlights, cuisine overview, and menu discovery links. |
| `/menu` | `app/menu/page.js` | Dynamic (`ƒ`) | **Menu Page** — Full menu with autofocus search, shareable query-string category filtering (`/menu?category=...`), and simulated loading/error test controls. |
| `/menu/[id]` | `app/menu/[id]/page.js` | Dynamic (`ƒ`) | **Dynamic Dish Page** — Reads `params` directly from component props (e.g. `/menu/kitfo` or `/menu/1`), without hooks. Calls `notFound()` for unknown dish IDs. |
| `/cart` | `app/cart/page.js` | Static (`○`) | **Cart Page** — Interactive shopping cart displaying selected items, quantity increments/decrements, tax computation (15%), and link to checkout. |
| `/checkout` | `app/checkout/page.js` | Static (`○`) | **TeleBirr Checkout Page** — Validated order submission form with Ethiopian phone validation, neighborhood selection, and order receipt generation. |
| *Catch-All / 404* | `app/not-found.js` | Static (`○`) | **Not Found State** — Rendered automatically for unmapped URLs (e.g. `/random-url`, `/menu/DishList`) and programmatically when `notFound()` is invoked. |

---

## App Folder Architecture

```
app/
├── layout.js               # Root shell with persistent Header, Footer, and Context Providers
├── page.js                 # Default export for / (Home)
├── not-found.js            # Custom 404 UI for bad URLs & notFound()
├── globals.css             # Global styles imported from src/index.css
├── providers.js            # Client-side context providers (AuthProvider & CartProvider)
├── Header.jsx              # Persistent navigation with active states & live cart count
├── Footer.jsx              # Persistent footer
├── Hero.jsx                # Landing hero banner with next/link navigation
├── menu/
│   ├── page.js             # Default export for /menu
│   ├── loading.js          # Suspense loading state for the menu segment
│   ├── error.js            # Client error boundary ("use client") for menu errors
│   ├── MenuClient.jsx      # Client view: autofocus search, category filtering, cart bar
│   ├── Card.jsx            # Colocated card container
│   ├── CategoryBar.jsx     # Colocated category chips
│   ├── Dish.jsx            # Colocated dish item using next/link
│   ├── DishList.jsx        # Colocated menu grid (DEMONSTRABLY NOT ROUTABLE)
│   └── [id]/
│       ├── page.js         # Default export for /menu/[id] (reads params from props)
│       └── DishDetail.jsx  # Colocated dish detail view
├── cart/
│   └── page.js             # Default export for /cart
└── checkout/
    ├── page.js             # Default export for /checkout
    └── OrderForm.jsx       # Colocated TeleBirr checkout form
```

---

## Verification & "Check Yourself" Checklist

### 1. Route Listing via `npm run build`
When executing `npm run build`, Next.js scans the `app/` folder tree and produces exactly the expected routes with no extraneous endpoints:

```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ○ /checkout
├ ƒ /menu
└ ƒ /menu/[id]

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

### 2. Colocated Menu Components are Demonstrably Unroutable
- `DishList.jsx`, `Dish.jsx`, `CategoryBar.jsx`, and `Card.jsx` are placed directly inside `app/menu/`.
- In Next.js App Router, routes are only established by files explicitly named `page.js`.
- Attempting to navigate to `http://localhost:3000/menu/DishList` does **not** render `DishList.jsx`; instead, the dynamic route handler detects no dish with id `"DishList"`, triggers `notFound()`, and serves `app/not-found.js` with a 404 status.

### 3. Dynamic Dish Page Works When Typed Directly into the Address Bar
- Navigating directly to `http://localhost:3000/menu/kitfo` loads the traditional Kitfo dish card with price (320 ETB), description, and Add to Cart action.
- Navigating to `http://localhost:3000/menu/1` loads Buna coffee.
- Parameter resolution is performed asynchronously from `props.params` in `app/menu/[id]/page.js`:
  ```javascript
  export default async function DishDetailPage({ params }) {
    const { id } = await params; // Read from props, not a hook!
    const dish = await fetchDishById(id);
    if (!dish) {
      notFound(); // Triggers not-found.js
    }
    return <DishDetail dish={dish} id={id} />;
  }
  ```

### 4. `loading.js` on the Menu Segment
- Declared at `app/menu/loading.js`.
- When loading the menu or when network throttling is enabled in DevTools, Next.js instantly renders `loading.js` with the café spinner and `"Loading the menu..."` message before streaming the page content.
- Can also be previewed by visiting `/menu?delay=2000`.

### 5. `error.js` on the Menu Segment
- Declared at `app/menu/error.js` marked with `"use client"`.
- Catches errors during segment rendering and displays the error icon, descriptive message, a "Try Again" reset button, and navigation options.
- Can be triggered either by:
  - Clicking the **"Deliberate throw (error.js)"** button in the diagnostics bar on `/menu`.
  - Navigating to `/menu?error=true`.

### 6. `not-found.js` Handling
- Declared at `app/not-found.js`.
- Reached via two distinct mechanisms:
  1. **Unmatched / Bad URL**: Navigating to any non-existent path (e.g. `/random-invalid-page`).
  2. **Calling `notFound()`**: Requesting an unknown dish ID in the dynamic route (e.g. `/menu/unknown-dish` or `/menu/not-a-dish`).

### 7. Internal Navigation via `next/link`
- Every link in the project (`Header`, `Hero`, `Home`, `Menu`, `Dish`, `DishDetail`, `Cart`, `Checkout`, `not-found.js`, `error.js`) uses `next/link` (`<Link href="...">`).
- Zero plain `<a>` anchors exist between internal routes.

---

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. Build for production (verifies full app/ route tree)
npm run build

# 3. Start production server
npm run start
# Server runs at http://localhost:3000

# 4. Or start development server
npm run dev
```
