# Addis Café (Addis Eats) — Multi-Screen React Router Application

A full multi-screen Ethiopian café and TeleBirr delivery web application built with React 19, React Router 7, Vite, PropTypes, and Context architecture.

## Technologies

- **React 19** (`useState`, `useEffect`, `useRef`, `useContext`, `createContext`)
- **React Router 7** (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `Link`, `NavLink`, `useParams`, `useSearchParams`, `useLocation`, `useNavigate`, `Navigate`)
- **PropTypes** (runtime prop type validation across components)
- **Vite** (Next-generation frontend tooling)
- **CSS3** (Responsive design, Ethiopian Café palette)

---

## Route Table & Architecture

The application is structured around a nested route table managed by React Router inside `src/App.jsx`. The root `Layout` acts as the persistent parent frame containing the persistent `Header` and `Footer`, while `<Outlet />` renders each page.

| Route Path | Screen / Component | Description | Access Level |
|---|---|---|---|
| `/` | `Home` (`src/Home.jsx`) | Landing page (index route) featuring hero section, Ethiopian Buna ceremony highlights, and menu discovery links. | Public |
| `/menu` | `Menu` (`src/Menu.jsx`) | Full menu with search autofocus and shareable query-string category filtering (`/menu?category=...`). | Public |
| `/menu/:id` | `DishDetail` (`src/DishDetail.jsx`) | Dynamic dish detail page reading route parameter `:id` via `useParams`. Gracefully handles unknown dish IDs. | Public |
| `/cart` | `Cart` (`src/Cart.jsx`) | Persistent order screen displaying dishes, quantity modifiers, tax, total in ETB, and checkout link. | Public |
| `/checkout` | `Checkout` (`src/Checkout.jsx`) | Validated TeleBirr delivery ordering form with live phone validation and order placement. | **Protected** (Requires Auth) |
| `/login` | `Login` (`src/Login.jsx`) | Authentication screen remembering the attempted destination and redirecting back after sign-in. | Public |
| `*` | `NotFound` (`src/NotFound.jsx`) | Catch-all 404 screen providing friendly navigation back to Home or Menu. | Public |

---

## Key Features & Requirement Implementation

### 1. Persistent Frame & Active Navigation (`src/Layout.jsx`)
- Built with `NavLink` components that automatically apply active styling (`.nav-link.active`) to highlight the current screen.
- Header displays a live cart item count badge (`Cart (3)`) sourced from `CartContext`.
- Keeps user login state and cart counters consistent across all screen navigations.

### 2. Shareable Category Filter (`src/Menu.jsx`)
- Category filter is stored in the URL query string using `useSearchParams`.
- Opening URLs such as `/menu?category=Vegan` or `/menu?category=Drink` in a new tab or browser window reads the parameter and renders the filtered list directly.
- The `useEffect` dependency array explicitly reads `[category]` to trigger network re-fetching on category changes.

### 3. Dynamic Dish Detail Route (`src/DishDetail.jsx`)
- Uses `useParams()` to read `:id`.
- If an invalid or nonexistent dish is accessed (e.g. `/menu/not-a-dish`), it renders a friendly `"Dish Not Found"` card rather than crashing.
- Includes full image display, spicy badge boolean guard, tax calculation, and direct "Add to Cart" functionality.

### 4. Cart Provider Mounted Above Router (`src/App.jsx`, `src/CartContext.jsx`)
- `<CartProvider>` wraps `<BrowserRouter>`, ensuring the order and items state survive every client navigation between `/`, `/menu`, `/menu/:id`, `/cart`, and `/checkout`.
- State is also backed by `localStorage` so refreshing the browser preserves the cart.

### 5. `RequireAuth` Protected Route Guard (`src/RequireAuth.jsx`)
- Guards the `/checkout` route.
- Checks `loading` state first to avoid premature redirects on browser refreshes when already signed in.
- Remembers the user's intended destination using `location.state.from`.
- If not authenticated, redirects to `/login` with `state={{ from: location }}`. Once the user signs in, they are immediately returned to `/checkout`.

### 6. Address Bar & Direct Navigation
- Every route (`/`, `/menu`, `/menu/1`, `/cart`, `/checkout`, `/login`) loads seamlessly when typed directly into the address bar.

---

## How to Run

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

---

