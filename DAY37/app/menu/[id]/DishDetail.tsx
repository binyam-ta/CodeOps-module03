"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Dish } from "@/lib/types";

interface DishDetailProps {
  dish: Dish;
  id?: string;
}

export default function DishDetail({ dish, id }: DishDetailProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const handleAddToCart = () => {
    if (!dish) return;
    addToCart(dish);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  const priceWithTax = (dish.price * 1.15).toFixed(0);

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
            <span className="dish-detail-tax">Incl. tax: {priceWithTax} ETB</span>
          </div>

          <div className="dish-detail-actions">
            <button
              type="button"
              className="hero-button add-to-cart-action-btn"
              onClick={handleAddToCart}
            >
              Add to Cart · {dish.price} ETB
            </button>
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
