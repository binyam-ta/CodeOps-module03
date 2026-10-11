"use client";

import { useState } from "react";
import Link from "next/link";

export default function Dish({
  id,
  slug,
  name,
  price,
  currency = "ETB",
  spicy = false,
  description,
  category,
  image,
  onAdd,
}) {
  const [added, setAdded] = useState(false);
  const priceWithTax = Math.round(price * 1.15);
  const detailHref = `/menu/${slug || id}`;

  const handleAddClick = (e) => {
    e.preventDefault();
    if (!onAdd) return;

    onAdd({
      id,
      slug,
      name,
      price,
      currency,
      category: category || "",
      description: description || "",
      image,
      spicy,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <article className="dish">
      {image && (
        <Link href={detailHref} className="dish-image-link" aria-label={`View ${name} details`}>
          <div className="dish-image">
            <img src={image} alt={name} loading="lazy" />
          </div>
        </Link>
      )}
      <div className="dish-body">
        <div className="dish-header">
          <h3 className="dish-name">
            <Link href={detailHref} className="dish-title-link">
              {name}
            </Link>{" "}
            {Boolean(spicy) && <span className="spicy-badge">• Spicy</span>}
          </h3>
          {category && <span className="dish-category">{category}</span>}
        </div>
        {description && <p className="dish-description">{description}</p>}
        <div className="dish-footer">
          <div className="dish-pricing">
            <span className="dish-price">
              {price} {currency}
            </span>
            <span className="dish-tax">Incl. tax: {priceWithTax} {currency}</span>
          </div>
          {onAdd && (
            <button
              type="button"
              className={`dish-add-btn ${added ? "dish-added" : ""}`}
              onClick={handleAddClick}
              aria-label={`Add ${name} to order`}
              style={added ? { backgroundColor: "var(--success-green)", transform: "scale(1.03)" } : {}}
            >
              {added ? "✓ Added!" : "+ Add"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
