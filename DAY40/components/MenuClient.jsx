"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

const CATEGORIES = ["All", "Main", "Breakfast", "Drink", "Dessert"];

export default function MenuClient({ initialDishes = [] }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef(null);

  const { addToCart, totalCount, totalAmount, isLoaded } = useCart();

  // Read URL query parameter on client mount without de-opting ISR
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam) {
        const matched = CATEGORIES.find(
          (c) => c.toLowerCase() === catParam.toLowerCase()
        );
        if (matched) {
          setCategory(matched);
        }
      }
    }
  }, []);

  const handleSelectCategory = (newCat) => {
    setCategory(newCat);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newCat === "All") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", newCat);
      }
      window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  };

  // Filter dishes by active category and search input
  const filteredByCategory =
    category === "All"
      ? initialDishes
      : initialDishes.filter(
          (d) => (d.category || "").toLowerCase() === category.toLowerCase()
        );

  const displayedDishes = filteredByCategory.filter((dish) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      (dish.name || "").toLowerCase().includes(q) ||
      (dish.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <section className="menu-section" id="menu">
      <div className="menu-intro">
        <h2 className="menu-heading">Our Ethiopian Menu</h2>
        <p className="menu-subtitle">
          Traditional Ethiopian dishes, fresh highland coffee, and authentic
          heritage recipes. Select a category below or search to find your favorites.
        </p>
      </div>

      {/* Search Bar */}
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

      {/* Interactive Category Filter Chips */}
      <CategoryBar
        categories={CATEGORIES}
        selected={category}
        onSelect={handleSelectCategory}
      />

      {/* Cart Summary Bar when items exist */}
      {mounted && isLoaded && totalCount > 0 && (
        <div className="order-summary-bar">
          <div className="order-summary-info">
            <span className="order-summary-label">Your Order:</span>
            <span className="order-summary-count">{totalCount} item(s)</span>
            <span className="order-summary-price">
              Total: <strong>{totalAmount} ETB</strong>
            </span>
          </div>
          <div className="order-summary-actions">
            <Link href="/cart" className="view-cart-btn">
              View Cart →
            </Link>
            <Link href="/checkout" className="checkout-shortcut-btn">
              Checkout
            </Link>
          </div>
        </div>
      )}

      {/* DishList renders dishes */}
      <DishList
        dishes={displayedDishes}
        onAdd={addToCart}
      />
    </section>
  );
}
