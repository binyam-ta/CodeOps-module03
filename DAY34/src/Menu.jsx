import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useFetch } from "./useFetch";
import { useCartStore } from "./cartStore";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

const CATEGORIES = ["All", "Main", "Breakfast", "Drink", "Dessert", "Vegan"];

function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";
  const searchInputRef = useRef(null);

  // State for deliberate thrown error to prove ErrorBoundary isolation
  const [simulateCrash, setSimulateCrash] = useState(false);

  // Narrow selectors from Zustand store
  const addItem = useCartStore((state) => state.addItem);
  const cartCount = useCartStore((state) => state.items.length);
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
  );

  // Deliberate thrown error for testing Error Boundary isolation
  if (simulateCrash || searchParams.get("crash") === "true") {
    throw new Error(
      "Deliberate error in Menu component: Proving Error Boundary fault isolation without taking down Cart or Header."
    );
  }

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
    <section className="menu-section" id="menu" aria-label="Menu Catalog">
      <div className="menu-intro">
        <div className="menu-intro-header">
          <span className="section-eyebrow">Culinary Catalog</span>
          <h2 className="menu-heading">Our Traditional Menu</h2>
          <p className="menu-subtitle">
            Explore authentic dishes crafted with heritage spices and fresh local ingredients.
            Select any item to view recipes or add directly to your order.
          </p>
        </div>
      </div>

      {/* Apple-style Search Bar with SVG Icon & Accessible Hit Targets */}
      <div className="search-bar-outer">
        <div className="search-bar-container">
          <span className="search-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>

          <input
            ref={searchInputRef}
            type="search"
            className="search-input"
            placeholder="Search by dish name, spice level, or description..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search dishes"
          />

          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => handleSearchChange("")}
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Apple Segmented Category Filter Chips */}
      <CategoryBar
        categories={CATEGORIES}
        selected={category}
        onSelect={handleSelectCategory}
      />

      {/* Floating Apple-Style Order Banner when items are present */}
      {cartCount > 0 && (
        <div className="order-summary-bar" role="region" aria-label="Current Order Summary">
          <div className="order-summary-info">
            <span className="order-summary-badge">{cartCount}</span>
            <div>
              <span className="order-summary-label">Your Order: </span>
              <span className="order-summary-price">
                <strong>{total} ETB</strong>
              </span>
            </div>
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

      {/* Discreet Developer / Testing Control at footer of Menu */}
      <aside className="dev-test-bar" aria-label="Developer Resilience Testing">
        <span className="dev-test-label">Resilience Testing:</span>
        <button
          type="button"
          className="simulate-crash-btn"
          onClick={() => setSimulateCrash(true)}
          title="Simulate runtime crash in Menu to verify Error Boundary fault isolation"
        >
          Simulate Menu Crash
        </button>
      </aside>
    </section>
  );
}

export default Menu;
