"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function DishDetail({ dish }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!dish) return null;

  const handleAddToCart = () => {
    addToCart(dish, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  const priceWithTax = Math.round(dish.price * 1.15);

  return (
    <div className="dish-detail-container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href="/menu">Menu</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{dish.name}</span>
      </nav>

      <div className="dish-detail-card">
        <div className="dish-detail-image-wrapper">
          <img src={dish.image} alt={dish.name} className="dish-detail-image" />
        </div>

        <div className="dish-detail-info">
          <div className="dish-detail-header">
            <span className="dish-category">{dish.category}</span>
            <h2 className="dish-detail-title">
              {dish.name}
              {Boolean(dish.spicy) && <span className="spicy-badge">• Spicy</span>}
            </h2>
          </div>

          <p className="dish-detail-desc">{dish.description}</p>

          <div className="dish-detail-pricing">
            <span className="dish-detail-price">{dish.price} ETB</span>
            <span className="dish-detail-tax">Incl. 15% tax: {priceWithTax} ETB</span>
          </div>

          <div className="dish-detail-actions" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div className="quantity-selector" style={{ background: "var(--cream-dark)", borderRadius: "var(--radius)" }}>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="hero-button add-to-cart-action-btn"
                onClick={handleAddToCart}
              >
                Add {quantity} to Cart · {dish.price * quantity} ETB
              </button>
            </div>

            {justAdded && (
              <span className="add-notification">
                ✓ Added to cart! <Link href="/cart">View Cart</Link>
              </span>
            )}
          </div>

          <div className="dish-detail-back">
            <Link href="/menu" className="back-to-menu-link">
              ← Back to Full Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
