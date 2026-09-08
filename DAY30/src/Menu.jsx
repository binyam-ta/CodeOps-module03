import { useState, useEffect, useRef, useMemo } from "react";
import { useFetch } from "./useFetch";
import { useCart } from "./CartProvider";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

const CATEGORIES = ["All", "Main", "Breakfast", "Drink", "Dessert", "Vegan"];

function Menu() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  const { addToCart } = useCart();

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const endpointUrl =
    category && category !== "All"
      ? `/dishes.json?category=${encodeURIComponent(category)}`
      : "/dishes.json";

  const { data, loading, error } = useFetch(endpointUrl);

  const filteredByCategory = useMemo(() => {
    if (!data) return [];
    if (!category || category === "All") return data;
    return data.filter(
      (dish) => dish.category.toLowerCase() === category.toLowerCase()
    );
  }, [data, category]);

  const displayedDishes = useMemo(() => {
    if (!search.trim()) return filteredByCategory;
    const q = search.toLowerCase().trim();
    return filteredByCategory.filter(
      (dish) =>
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q)
    );
  }, [filteredByCategory, search]);

  return (
    <section className="menu-section" id="menu">
      <div className="menu-intro">
        <h2 className="menu-heading">Our Menu</h2>
        <p className="menu-subtitle">
          Traditional Ethiopian dishes and freshly brewed coffee. Select dishes to
          add them to your cart.
        </p>
      </div>

      {/* Search Bar with useRef autofocus */}
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

      {/* Category filter driving the fetch */}
      <CategoryBar
        categories={CATEGORIES}
        selected={category}
        onSelect={setCategory}
      />

      {/* DishList renders loading, error, empty state, and dishes with early returns */}
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
