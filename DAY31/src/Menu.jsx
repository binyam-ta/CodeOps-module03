import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchDishes } from "./api";
import { useCart } from "./CartContext";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

const CATEGORIES = ["All", "Main", "Breakfast", "Drink", "Dessert", "Vegan"];

function Menu() {
  // Read category filter from URL query string so URLs like /menu?category=Vegan are shareable
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";

  const { addToCart, totalCount, totalAmount } = useCart();

  // Dishes loaded from endpoint and stored in state
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search input state and ref for autofocus on mount
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  // Autofocus the search input on mount with useRef
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchDishes(category, controller.signal);
        setDishes(data);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "Could not load the menu");
        }
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [category]);

  // Update query string in the URL when category chip is clicked
  const handleSelectCategory = (newCat) => {
    const nextParams = new URLSearchParams(searchParams);
    if (newCat === "All") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", newCat);
    }
    setSearchParams(nextParams);
  };

  // Filter dishes by search term
  const displayedDishes = dishes.filter((dish) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      dish.name.toLowerCase().includes(q) ||
      dish.description.toLowerCase().includes(q)
    );
  });

  return (
    <section className="menu-section" id="menu">
      <div className="menu-intro">
        <div className="location-bar">
          <span className="location-text">Bole, Addis Ababa</span>
          <span className="location-line"></span>
        </div>
        <h2 className="menu-heading">Our Menu</h2>
        <p className="menu-subtitle">
          A selection of traditional Ethiopian dishes, fresh coffee, and local
          favorites. Click any dish to view its details or add it directly to your cart.
        </p>
      </div>

      {/* Search Bar focused on mount with useRef */}
      <div className="search-bar-container">
        <input
          ref={searchInputRef}
          type="search"
          className="search-input"
          placeholder="Search dishes by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search dishes"
        />
        {search && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearch("")}
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

      {/* Cart Summary Bar when order has items */}
      {totalCount > 0 && (
        <div className="order-summary-bar">
          <div className="order-summary-info">
            <span className="order-summary-label">Your Cart:</span>
            <span className="order-summary-count">{totalCount} item(s)</span>
            <span className="order-summary-price">
              Total: <strong>{totalAmount} ETB</strong>
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

      {/* DishList renders loading, error, empty, and dishes list with early returns */}
      <DishList
        dishes={displayedDishes}
        loading={loading}
        error={error}
        onAdd={addToCart}
      />
    </section>
  );
}

export default Menu;
