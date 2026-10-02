"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Dish } from "@/lib/types";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

const CATEGORIES = ["All", "Main", "Breakfast", "Drink", "Dessert"];

interface MenuClientProps {
  initialDishes?: Dish[];
  initialCategory?: string;
}

export default function MenuClient({
  initialDishes = [],
  initialCategory = "All",
}: MenuClientProps) {
  const router = useRouter();
  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { addToCart, totalCount, totalAmount } = useCart();
  const [triggerError, setTriggerError] = useState<boolean>(false);

  if (triggerError) {
    throw new Error("Deliberate throw in Menu component to demonstrate error.js!");
  }

  // Autofocus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Sync category if initialCategory changes
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const handleSelectCategory = (newCat: string) => {
    setCategory(newCat);
    if (newCat === "All") {
      router.push("/menu");
    } else {
      router.push(`/menu?category=${encodeURIComponent(newCat)}`);
    }
  };

  // Filter dishes by active category and search input
  const filteredByCategory =
    category === "All"
      ? initialDishes
      : initialDishes.filter(
          (d) => d.category?.toLowerCase() === category.toLowerCase()
        );

  const displayedDishes = filteredByCategory.filter((dish) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      dish.name.toLowerCase().includes(q) ||
      dish.description?.toLowerCase().includes(q)
    );
  });

  return (
    <section className="menu-section" id="menu">
      <div className="menu-intro">
        <h2 className="menu-heading">Our Menu</h2>
        <p className="menu-subtitle">
          A selection of traditional Ethiopian dishes, fresh coffee, and local
          favorites. Click any dish to view its details or add it directly to your cart.
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
