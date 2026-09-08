# Addis Café (Addis Eats) — State, Reducer, Context & Custom Hook Architecture

A unified React application bringing together everything from Days 26 to 30: components and props, state and events, an API-driven menu with loading and error states, a category filter, a cart shared across the whole screen through context, a reducer that owns every cart transition, and a custom `useFetch` hook.

---

## What Each Hook & Module Contributes

### 1. `src/cartReducer.js`
- **Role**: Pure reducer function managing all shopping cart state transitions (`add`, `remove`, `clear`).
- **Purity**: Zero side effects and zero external dependencies; callable directly outside of React.
- **Derived State Philosophy**: The total amount in ETB is **not** stored in the reducer state; it is dynamically derived on render to avoid state duplication and synchronization bugs.

### 2. `src/CartProvider.jsx` (`useReducer`, `useMemo`, `useCallback`, `useContext`)
- **`useReducer`**: Manages the cart state using `cartReducer`.
- **`useMemo` (Derived Total)**: Calculates `total = state.items.reduce((s, d) => s + d.price, 0)` on render, recomputing only when `state.items` changes.
- **`useCallback` (Action Dispatchers)**: `addToCart`, `removeFromCart`, and `clearCart` are memoized so their function references remain stable across re-renders.
- **`useMemo` (Provider Value)**: Memoizes the context value object `{ items, dispatch, total, addToCart, removeFromCart, clearCart }`.
  - **Justification**: Without this `useMemo`, an object literal creates a brand-new object reference on every parent render, forcing every subscriber (`CartBadge`, `CheckoutPanel`, etc.) to re-render even if cart items haven't changed.
- **`useCart()`**: Custom hook encapsulating `useContext(CartContext)` with a helpful error guard if called outside `<CartProvider>`.

### 3. `src/useFetch.js` (`useState`, `useEffect`)
- **Role**: Custom hook for asynchronous data fetching returning `{ data, loading, error }`.
- **`AbortController` Cleanup**: Instantiates an `AbortController` and passes its `signal` to `fetch(url, { signal })`. When the target `url` changes (e.g., when the user switches categories), the cleanup function calls `controller.abort()`, cancelling the previous in-flight request in browser DevTools.
- **Non-Stuck Spinner**: Guarantees that `setLoading(false)` is called in the `finally` block when the request finishes or fails.

### 4. `src/CartBadge.jsx` (`useContext` via `useCart`)
- **Role**: Cart counter component displayed in the header.
- **Zero Prop Drilling**: Directly consumes `items` and `total` from `useCart()`. It takes **zero props** from its parent `Header`.
- **Synchronized UI**: Immediately reflects additions, removals, and clears in real time alongside `CheckoutPanel`.

### 5. `src/Menu.jsx` (`useState`, `useRef`, `useMemo`, `useFetch`, `useCart`)
- **`useFetch` Integration**: Driven by `category` state (`/dishes.json?category=...`).
- **All Three States Handled**:
  1. **Loading**: Displays animated spinner and loading message.
  2. **Error**: Displays human-readable error if fetching fails or endpoint is missing.
  3. **Empty State**: Displays friendly note when an empty category (e.g., `"Vegan"`) has 0 dishes.
- **`useRef`**: Autofocuses the search input on mount without causing re-renders.
- **Justified `useMemo`**:
  - `filteredByCategory`: Memoizes the category filtering so it doesn't re-run during unrelated search keystrokes or cart updates.
  - `displayedDishes`: Memoizes search text filtering across dishes.

### 6. `src/CheckoutPanel.jsx` (`useContext` via `useCart`, `useState`)
- **Zero Prop Drilling**: Directly reads `{ items, total, removeFromCart, clearCart }` from `useCart()`.
- **TeleBirr Form**: Controlled form with live regex validation (`/^(?:\+251|0)[97]\d{8}$/`).
- **Action Dispatching**: Dispatches removals and order completion clear actions directly through context.

---

## Running & Verifying the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build
npm run build
```
