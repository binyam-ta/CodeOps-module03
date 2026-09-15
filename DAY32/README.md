# Addis Café (Addis Eats) — Zustand Cart Store & Guarded Context Architecture

A full multi-screen Ethiopian café and TeleBirr delivery web application built with React 19, React Router, and Zustand.

---

## 🏛️ Why the Cart is in a Zustand Store and the Session is in Context

> **One-Sentence Summary**:  
> The session stayed in React Context because it represents coarse, low-frequency ambient identity required for route guarding across the tree, whereas the cart lives in a Zustand store because it requires high-frequency mutations with narrow selector subscriptions to prevent broad component re-renders.

### 1. The Cart (Zustand Store + `persist`)
- **Frequent Mutations**: Adding dishes, removing items, and clearing the cart happen frequently during user interaction.
- **Narrow Selectors**: Components like `<CartBadge />` only need `items.length` and total cost; `<DishDetail />` only needs the `addItem` action. With Zustand, components select only the exact slice of state they require (`useCartStore(s => s.items.length)`). When an item is added, **only the badge re-renders** — the `<Header />` and `<Layout />` do not re-render at all!
- **Zero Provider Overhead**: Moving to Zustand allowed completely removing `<CartProvider>` without breaking any application code or requiring provider wrapping.
- **Built-in Persistence**: Configured with the `persist` middleware (`name: "addis-eats-cart"`), ensuring cart contents survive full browser reloads and tab navigations seamlessly.

### 2. The Auth Session (Guarded React Context)
- **Infrequent Changes**: Authentication state only changes on explicit user actions (login / logout).
- **Tree-Bound Route Guarding**: Route guards like `<RequireAuth>` naturally fit within React’s component hierarchy and lifecycle, managing early returns and redirect state (`location.state.from`).
- **Guarded Hook (`useAuth`)**: Throws an actionable runtime error (`"useAuth must be used within an AuthProvider"`) if consumed outside its provider boundary.
- **Separate from Theme**: Theme management is decoupled into its own independent `<ThemeProvider>` and guarded `useTheme()` hook, eliminating bundled multi-purpose contexts.

---

## 🗺️ Route Table

| Route Path | Screen Component | Description | Access Level |
|---|---|---|---|
| `/` | `Home` (`src/Home.jsx`) | Landing page (index route) with Buna ceremony highlights and menu call-to-action. | Public |
| `/menu` | `Menu` (`src/Menu.jsx`) | Interactive menu with search autofocus and shareable query-string category filtering (`/menu?category=...`). | Public |
| `/menu/:id` | `DishDetail` (`src/DishDetail.jsx`) | Dynamic dish detail page reading `:id` via `useParams`. Gracefully handles unknown dish IDs without crashing. | Public |
| `/cart` | `Cart` (`src/Cart.jsx`) | Persistent order screen with dish list, subtotal, 15% tax in ETB, item removal, and checkout link. | Public |
| `/checkout` | `Checkout` (`src/Checkout.jsx`) | Validated TeleBirr delivery form wrapped in `<RequireAuth>`. | **Protected** (Requires Login) |
| `/login` | `Login` (`src/Login.jsx`) | Authentication screen remembering the attempted destination and redirecting back after sign-in. | Public |
| `*` | `NotFound` (`src/NotFound.jsx`) | Catch-all 404 screen providing navigation back to Home or Menu. | Public |

---

## 🧩 State Architecture & Narrow Selectors

Every cart consumer uses narrow selectors rather than bare `useCartStore()` calls:

- **`CartBadge.jsx`**:
  ```javascript
  const count = useCartStore((state) => state.items.length);
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
  );
  ```
- **`DishDetail.jsx`**:
  ```javascript
  const addItem = useCartStore((state) => state.addItem);
  ```
- **`Menu.jsx`**:
  ```javascript
  const addItem = useCartStore((state) => state.addItem);
  const cartCount = useCartStore((state) => state.items.length);
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
  );
  ```
- **`Cart.jsx`**:
  ```javascript
  const items = useCartStore((state) => state.items);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);
  ```
- **`Checkout.jsx`**:
  ```javascript
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  ```

---

## 🎯 Self-Check Checklist

| Check / Question | Status | Verification |
|---|---|---|
| **Does removing the CartProvider break anything at all?** | ✅ Yes | `CartProvider` was deleted from the codebase and the application builds and runs with 0 errors. |
| **Does adding a dish still re-render the header, or only the badge?** | ✅ Yes | The `Header` does not subscribe to the cart store; only `CartBadge` subscribes to `items.length` and total. |
| **Does the order survive a full page refresh?** | ✅ Yes | The `persist` middleware rehydrates `items` from localStorage under `addis-eats-cart`. |
| **Does every component select one value rather than the whole store?** | ✅ Yes | All consumers use explicit `(state) => state.slice` selectors; no bare `useCartStore()` calls exist. |
| **Does using a context hook outside its provider throw a message you can act on?** | ✅ Yes | `useAuth()` throws `"useAuth must be used within an AuthProvider"`; `useTheme()` throws `"useTheme must be used within a ThemeProvider"`. |
| **Can you say in one sentence why the session stayed in context?** | ✅ Yes | See the bold summary above. |

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
