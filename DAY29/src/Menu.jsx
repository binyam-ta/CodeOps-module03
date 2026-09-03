import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { fetchDishes } from "./api";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import OrderForm from "./OrderForm";

const CATEGORIES = ["All", "Main", "Breakfast", "Drink", "Dessert", "Vegan"];

function Menu({ initialCategory = "All" }) {
  // Dishes loaded from endpoint and stored in state
  const [dishes, setDishes] = useState([]);

  // Separate loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category filter state (drives new fetch request)
  const [category, setCategory] = useState(initialCategory);

  // Search input state and ref for autofocus on mount
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  // Order total state in ETB and order items tracker
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderItems, setOrderItems] = useState([]);

  // Autofocus the search input on mount with useRef
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Fetch dishes from endpoint with AbortController cancellation in cleanup
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchDishes(category, controller.signal);
        setDishes(data);
      } catch (e) {
        // Ignore abort cancellations when switching categories quickly
        if (e.name !== "AbortError") {
          setError(e.message || "Could not load the menu");
        }
      } finally {
        // setLoading(false) in finally so spinner never gets stuck
        setLoading(false);
      }
    }

    load();

    // AbortController cleanup cancels the previous request when switching categories quickly
    return () => {
      controller.abort();
    };
  }, [category]);

  // Click handler to add dish and increment order total in ETB
  const handleAddDish = (dish) => {
    setOrderTotal((prev) => prev + dish.price);
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.name === dish.name);
      if (existing) {
        return prev.map((item) =>
          item.name === dish.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const handleClearOrder = () => {
    setOrderTotal(0);
    setOrderItems([]);
  };

  // Filter fetched dishes by search term if provided
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
        <h2 className="menu-heading">Our Menu</h2>
        <p className="menu-subtitle">
          A selection of traditional Ethiopian dishes, fresh coffee, and local
          favorites. Click dishes to add them to your TeleBirr delivery order.
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

      {/* Category Filter Chips */}
      <CategoryBar
        categories={CATEGORIES}
        selected={category}
        onSelect={setCategory}
      />

      {/* Order Total Sticky / Summary Banner */}
      <div className="order-summary-bar">
        <div className="order-summary-info">
          <span className="order-summary-label">Current Order:</span>
          <span className="order-summary-count">
            {orderItems.reduce((acc, i) => acc + i.quantity, 0)} item(s)
          </span>
          <span className="order-summary-price">
            Total: <strong>{orderTotal} ETB</strong>
          </span>
        </div>
        {orderTotal > 0 && (
          <button
            type="button"
            className="order-clear-btn"
            onClick={handleClearOrder}
          >
            Clear Order
          </button>
        )}
      </div>

      {/* DishList renders loading, error, empty, and dishes list with early returns */}
      <DishList
        dishes={displayedDishes}
        loading={loading}
        error={error}
        onAdd={handleAddDish}
      />

      {/* TeleBirr Delivery Form */}
      <section className="order-section" id="order">
        <OrderForm orderTotal={orderTotal} onClearOrder={handleClearOrder} />
      </section>
    </section>
  );
}

Menu.propTypes = {
  initialCategory: PropTypes.string,
};

export default Menu;
