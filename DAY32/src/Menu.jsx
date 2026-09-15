import { useEffect, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useFetch } from "./useFetch";
import { useCartStore } from "./cartStore";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

const CATEGORIES = ["All", "Main", "Breakfast", "Drink", "Dessert", "Vegan"];

function Menu() {
  // Category filter stored in the query string so URLs like /menu?category=Vegan can be shared
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";
  const searchInputRef = useRef(null);

  // Narrow selectors: only select specific pieces from Zustand store — no bare useCartStore() calls
  const addItem = useCartStore((state) => state.addItem);
  const cartCount = useCartStore((state) => state.items.length);
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
  );

  // Search input focused on mount with useRef
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Category in query string drives the fetch URL
  const endpointUrl =
    category && category !== "All"
      ? `/dishes.json?category=${encodeURIComponent(category)}`
      : "/dishes.json";

  const { data, loading, error } = useFetch(endpointUrl);

  // Memoize category filtering to prevent re-filtering on search keystrokes
  const filteredByCategory = useMemo(() => {
    if (!data) return [];
    if (!category || category === "All") return data;
    return data.filter(
      (dish) => dish.category.toLowerCase() === category.toLowerCase()
    );
  }, [data, category]);

  // Filter by search query
  const displayedDishes = useMemo(() => {
    if (!search.trim()) return filteredByCategory;
    const q = search.toLowerCase().trim();
    return filteredByCategory.filter(
      (dish) =>
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q)
    );
  }, [filteredByCategory, search]);

  const handleSelectCategory = (newCat) => {
    const next = new URLSearchParams(searchParams);
    if (newCat === "All") {
      next.delete("category");
    } else {
      next.set("category", newCat);
    }
    setSearchParams(next);
  };

  const handleSearchChange = (val) => {
    const next = new URLSearchParams(searchParams);
    if (!val) {
      next.delete("search");
    } else {
      next.set("search", val);
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <section className="menu-section" id="menu">
      <div className="menu-intro">
        <div className="location-bar">
          <span className="location-text">Bole, Addis Ababa</span>
          <span className="location-line"></span>
        </div>
        <h2 className="menu-heading">Our Menu</h2>
        <p className="menu-subtitle">
          A selection of traditional Ethiopian dishes and freshly roasted coffee.
          Click any dish to see details or add directly to your order.
        </p>
      </div>

      {/* Search Input focused on mount with useRef */}
      <div className="search-bar-container">
        <input
          ref={searchInputRef}
          type="search"
          className="search-input"
          placeholder="Search dishes by name or description..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          aria-label="Search dishes"
        />
        {search && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => handleSearchChange("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Shareable Category Filter Chips */}
      <CategoryBar
        categories={CATEGORIES}
        selected={category}
        onSelect={handleSelectCategory}
      />

      {/* Order Banner when items are present */}
      {cartCount > 0 && (
        <div className="order-summary-bar">
          <div className="order-summary-info">
            <span className="order-summary-label">Cart Summary:</span>
            <span className="order-summary-count">{cartCount} item(s)</span>
            <span className="order-summary-price">
              Total: <strong>{total} ETB</strong>
            </span>
          </div>
          <div className="order-summary-actions">
            <Link to="/cart" className="view-cart-btn">
              View Cart →
            </Link>
            <Link to="/checkout" className="checkout-shortcut-btn">
              Checkout
            </Link>
          </div>
        </div>
      )}

      {/* DishList renders loading, error, empty state, and dishes with early returns */}
      <DishList
        dishes={displayedDishes}
        loading={loading}
        error={error}
        onAdd={addItem}
      />
    </section>
  );
}

export default Menu;
