# Addis Café — Project Documentation

## 1. Project Overview

**Addis Café** (also referred to as "Addis Eats") is a production-grade Ethiopian restaurant e-commerce web application. It allows customers to browse an authentic Ethiopian menu, manage a shopping cart, and complete orders via TeleBirr (Ethiopia's leading mobile payment platform) with delivery across Addis Ababa neighborhoods.

### 1.1 Key Features

- **Full Menu Catalog** — Browse dishes by category (Main, Breakfast, Drink, Dessert, Vegan) with live search and filtering
- **Dish Details** — Dedicated product pages with quantity controls and add-to-cart actions
- **Shopping Cart** — Persistent cart (localStorage-backed via Zustand persist) with line-item removal and order summary
- **Secure Checkout** — TeleBirr payment flow with form validation (name, Ethiopian phone regex, delivery area select)
- **Authentication Flow** — Login screen with guarded `/checkout` route (redirects unauthenticated users, remembers destination)
- **Light/Dark Theme** — User-preference theme toggle persisted in localStorage
- **Resilience & Error Boundaries** — Independent fault isolation per route (Menu, Cart, Checkout each has its own boundary so one crash doesn't break the entire app)
- **Code-Splitting & Lazy Loading** — Heavy transactional routes (Cart, Checkout, DishDetail) are split into separate chunks with Suspense skeleton fallbacks
- **Accessible UI Primitives** — Portal-based Modal (focus trapping, Escape close, focus return), 44px touch targets, ARIA labels throughout

### 1.2 Tech Stack

| Layer | Library | Purpose |
|---|---|---|
| Core UI | **React 19** | Component model, Suspense, lazy loading |
| Routing | **React Router 7** | Browser router, nested routes, search params, `Navigate` guard |
| State Management | **Zustand 5** | Cart store with `persist` middleware (localStorage) |
| Runtime Type Safety | **PropTypes 15** | Component prop validation |
| Build Tool | **Vite 8** | Fast dev server, HMR, production bundling & code-splitting |
| Linting | **Oxlint** | Fast Rust-based ESLint-compatible linter |

---

## 2. Project Structure

```
src/
├── auth/                     # Auth-specific components & guards
│   └── RequireAuth.jsx       # Route guard: redirects unauthenticated users to /login
│
├── components/               # Reusable UI building blocks (NOT route-level pages)
│   ├── Card.jsx              # Generic wrapper card with className passthrough
│   ├── CartBadge.jsx         # Header cart icon badge with item count + total (narrow Zustand selectors)
│   ├── CategoryBar.jsx       # Apple-style segmented category filter chips
│   ├── CheckoutPanel.jsx     # Legacy standalone checkout panel (form + cart summary)
│   ├── Dish.jsx              # Dish card component (memoized) with Quick View modal + add-to-cart
│   ├── DishList.jsx          # Dish grid renderer with loading/error/empty early-return states
│   ├── ErrorBoundary.jsx     # Class-component ErrorBoundary with custom fallback renderer
│   ├── Footer.jsx            # Site footer (brand info, quick links, hours/location)
│   ├── Header.jsx            # Site header: brand, NavLink nav, theme toggle, CartBadge, auth status
│   ├── Hero.jsx              # Home page hero banner with CTA buttons
│   ├── Layout.jsx            # Persistent outer frame: Header + <Outlet /> + Footer
│   └── OrderForm.jsx         # Reusable checkout form with TeleBirr validation + success receipt
│
├── context/                  # React Context providers
│   ├── AuthContext.jsx       # AuthProvider: user state, login/logout, localStorage persistence
│   └── ThemeContext.jsx      # ThemeProvider: light/dark theme, document[data-theme] attribute
│
├── hooks/                    # Custom React hooks (consume context, encapsulate logic)
│   ├── useAuth.js            # Guarded hook: useContext(AuthContext) + provider-check throw
│   ├── useFetch.js           # Generic data-fetching hook with AbortController cleanup
│   └── useTheme.js           # Guarded hook: useContext(ThemeContext) + provider-check throw
│
├── pages/                    # Route-level page components (mapped in App.jsx <Routes>)
│   ├── Cart.jsx              # /cart — Full shopping cart page with summary sidebar
│   ├── Checkout.jsx          # /checkout — TeleBirr checkout (guarded by RequireAuth)
│   ├── DishDetail.jsx        # /menu/:id — Single dish detail page with quantity stepper
│   ├── Home.jsx              # / — Landing page with Hero + feature cards + CTA banner
│   ├── Login.jsx             # /login — Sign-in form with demo 1-click login
│   ├── Menu.jsx              # /menu — Menu catalog with search bar + category filter + floating order bar
│   └── NotFound.jsx          # * — 404 catch-all route
│
├── store/                    # State management stores & reducers
│   ├── cartReducer.js        # Pure cart reducer: add / remove / clear actions (legacy / reference)
│   └── cartStore.js          # Zustand store: useCartStore() — items, addItem, remove, clear (persisted)
│
├── ui/                       # Low-level / primitive / atomic UI components
│   ├── Modal.jsx             # Accessible portal Modal: focus trap, Escape close, focus return, scroll lock
│   └── Skeleton.jsx          # Suspense skeletons: CheckoutSkeleton, PageSkeleton (pulsing placeholders)
│
├── utils/                    # Pure utilities: API clients, static data, helpers
│   ├── api.js                # Fetch helpers: fetchDishes(category), fetchDishById(id)
│   └── data.js               # Static fallback dishes array (reference / seed data)
│
├── App.jsx                   # Root app component: providers, routes, error boundaries, lazy imports
├── main.jsx                  # Entry point: createRoot + StrictMode + App mount
└── index.css                 # Global stylesheet (all app CSS: layout, components, themes, animations)
```

---

## 3. Architectural Decisions & Why I Structure It This Way

Each folder was chosen according to established React community conventions. The goal is **scalability** (a new developer can guess where a file lives), **separation of concerns** (logic vs rendering vs state), and **tooling friendliness** (fast-refresh boundaries, barrel exports if needed).

### 3.1 `pages/` vs `components/`

This is the single most important structural distinction.

**`pages/`** contains **route-level components** — one file per `<Route>` in [App.jsx](file:///C:/Users/Administrator/Videos/DAY34/src/App.jsx#L130-L184). These are the "screens" users navigate to. They tend to:
- Read URL params / search params (`useParams`, `useSearchParams`)
- Compose multiple `components/` together
- Own page-level state (e.g., Menu's search query, DishDetail's quantity)
- Never be imported by another page or component (except by `App.jsx` for routing)

**`components/`** contains **reusable UI building blocks** that are *composed inside pages* (or inside other components). Examples:
- A [Header](file:///C:/Users/Administrator/Videos/DAY34/src/components/Header.jsx) is used by [Layout](file:///C:/Users/Administrator/Videos/DAY34/src/components/Layout.jsx) which wraps every page.
- A [Dish](file:///C:/Users/Administrator/Videos/DAY34/src/components/Dish.jsx) card is rendered in a loop by [DishList](file:///C:/Users/Administrator/Videos/DAY34/src/components/DishList.jsx).
- [OrderForm](file:///C:/Users/Administrator/Videos/DAY34/src/components/OrderForm.jsx) could theoretically be reused in a future "reorder" modal.

> **Why this matters**: When the app grows to 30+ routes, having a clear `pages/` directory makes navigation code trivial to audit. You never wonder "is this file a page or a button?"

### 3.2 `context/` + `hooks/` — The Provider / Hook Pair Pattern

Every Context has a matching guarded hook:
- [AuthContext.jsx](file:///C:/Users/Administrator/Videos/DAY34/src/context/AuthContext.jsx) → [useAuth.js](file:///C:/Users/Administrator/Videos/DAY34/src/hooks/useAuth.js)
- [ThemeContext.jsx](file:///C:/Users/Administrator/Videos/DAY34/src/context/ThemeContext.jsx) → [useTheme.js](file:///C:/Users/Administrator/Videos/DAY34/src/hooks/useTheme.js)

The **Context** file holds the `Provider` component (state, effects, persistence).
The **Hook** file is the *only consumer API* — it throws an error if used outside its provider, giving new developers an immediate, actionable crash instead of a silent `null` context bug.

> **Why separate files?** Oxlint's `react(only-export-components)` rule correctly warns that mixing `createContext` value exports with component exports breaks Fast Refresh. Keeping Context value + guarded hook in separate files preserves hot-module reloading.

### 3.3 `store/` — Dedicated State Management

The Zustand store lives in [cartStore.js](file:///C:/Users/Administrator/Videos/DAY34/src/store/cartStore.js) and a legacy pure reducer is in [cartReducer.js](file:///C:/Users/Administrator/Videos/DAY34/src/store/cartReducer.js).

Key principles applied:
- **Narrow selectors everywhere** — No component calls bare `useCartStore()`. Every consumer plucks exactly the fields it needs (e.g., CartBadge only subscribes to `items.length` and the computed total, not the entire items array). This prevents spurious re-renders.
- **Persistence is middleware** — Zustand's `persist` middleware handles localStorage read/write out-of-band; components don't need to know about it.
- **No derived state in store** — The store stores only `items: []`. Totals, counts, and tax are *derived at render time* inside components (DRY, single source of truth).

> **Why a separate folder?** As the app scales (orders store, user profile store, UI flags store), having a single `store/` directory avoids the "20 loose files in root" problem.

### 3.4 `auth/` — Authentication Concern

[RequireAuth.jsx](file:///C:/Users/Administrator/Videos/DAY34/src/auth/RequireAuth.jsx) is a route guard, not a general component. It:
- Consumes `useAuth()` + `useLocation()`
- Shows a loading spinner while auth hydrates from localStorage (prevents flash of login page on refresh)
- Redirects unauthenticated users to `/login` with `location.state.from` remembered

> **Why its own folder?** Auth is a *cross-cutting concern* separate from UI building blocks. Future auth utilities (role checks, permission hooks, logout timers) would naturally land here.

### 3.5 `ui/` — Primitive / Atomic Components

The `ui/` folder predates the reorganization and was preserved intentionally. It holds the lowest-level building blocks:
- [Modal.jsx](file:///C:/Users/Administrator/Videos/DAY34/src/ui/Modal.jsx) — portal-based primitive (used by Dish Quick View)
- [Skeleton.jsx](file:///C:/Users/Administrator/Videos/DAY34/src/ui/Skeleton.jsx) — Suspense loading placeholders (used by App's lazy routes)

These are distinguished from `components/` by being **framework-like** — you could drop `ui/Modal.jsx` into *any* React project unchanged, whereas `components/Dish.jsx` is Addis-Café-specific.

### 3.6 `utils/` — Pure Utilities

- [api.js](file:///C:/Users/Administrator/Videos/DAY34/src/utils/api.js) — Data fetching functions. Completely React-agnostic; can be unit-tested without JSX.
- [data.js](file:///C:/Users/Administrator/Videos/DAY34/src/utils/data.js) — Static seed data.

> **Rule of thumb for `utils/`**: If a file has no React imports and no JSX, it belongs here.

---

## 4. Data Flow & Call Graph (Mental Model)

```
main.jsx → <App/>
              │
              ├── <ThemeProvider>    [context/ThemeContext.jsx]
              │     │
              │     └── <AuthProvider>    [context/AuthContext.jsx]
              │           │
              │           └── <BrowserRouter>
              │                 │
              │                 └── <Routes>
              │                       │
              │                       ├── "/"  → <Layout>  [components/Layout.jsx]
              │                       │          ├── <Header>  → CartBadge + useAuth + useTheme
              │                       │          ├── <Outlet>  (child routes render here)
              │                       │          └── <Footer>
              │                       │
              │                       │  (Outlet children)
              │                       ├── index            → <Home>          [pages/Home.jsx]
              │                       ├── menu             → <ErrorBoundary> → <Menu>         [pages/Menu.jsx]
              │                       ├── menu/:id         → <ErrorBoundary> → Suspense → <DishDetail>
              │                       ├── cart             → <ErrorBoundary> → Suspense → <Cart>
              │                       ├── checkout         → <ErrorBoundary> → Suspense → <RequireAuth> → <Checkout>
              │                       ├── login            → <Login>         [pages/Login.jsx]
              │                       └── *                → <NotFound>      [pages/NotFound.jsx]
              │
              └── (Global store)  → useCartStore()   [store/cartStore.js]  ← every page/component that needs cart state
```

### 4.1 Cart Data Flow Example
1. User clicks "+ Add" on a Dish card in `pages/Menu.jsx`
2. `Menu.jsx` calls `addItem(dish)` — obtained via `useCartStore(s => s.addItem)`
3. Zustand updates `items: []` and writes to localStorage (`persist` middleware)
4. **Only** the narrow subscribers re-render:
   - `CartBadge` re-renders (it subscribes to `.items.length` + total)
   - `Cart.jsx` re-renders when user navigates to `/cart`
   - `Checkout.jsx` renders the summary sidebar

---

## 5. Build & Quality Commands

| Command | Description |
|---|---|
| `npm install` | Install all dependencies |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build — outputs code-split chunks to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint across `src/` |

---

## 6. Roadmap / Future Structure Extensions

When the project grows, these are the natural next folders to add (preemptively designed into the current layout):

- **`src/lib/`** — For 3rd-party client initialization wrappers (e.g., a Stripe/TeleBirr SDK client, Supabase setup)
- **`src/constants/`** — When `DELIVERY_AREAS` and `TELEBIRR_REGEX` (currently duplicated in CheckoutPanel and OrderForm) are extracted to a single source of truth
- **`src/features/`** — If adopting a feature-sliced design later, each domain (cart, menu, auth, checkout) would become a feature folder containing its own components/hooks/pages
- **Barrel `index.js` exports** — Once a folder has ≥5 files, add an `index.js` to re-export so imports collapse to `import { Card, Dish, DishList } from '../components'`
