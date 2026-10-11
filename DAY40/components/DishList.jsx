"use client";

import Card from "./Card";
import Dish from "./Dish";

export default function DishList({
  dishes = [],
  loading = false,
  error = null,
  onAdd,
}) {
  if (loading) {
    return (
      <div className="menu-status-container loading">
        <div className="spinner" />
        <p className="loading-message">Loading the menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-status-container error">
        <div className="error-icon">⚠️</div>
        <p className="err">{error}</p>
      </div>
    );
  }

  if (!dishes || dishes.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">No Dishes Found</p>
        <p className="empty-state-text">No dishes found matching this selection.</p>
      </div>
    );
  }

  return (
    <div className="menu-grid">
      {dishes.map((dish) => (
        <Card key={dish.id} className="menu-card">
          <Dish
            id={dish.id}
            slug={dish.slug}
            name={dish.name}
            price={dish.price}
            description={dish.description}
            category={dish.category}
            spicy={dish.spicy}
            image={dish.image}
            onAdd={onAdd}
          />
        </Card>
      ))}
    </div>
  );
}
