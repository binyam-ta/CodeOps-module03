"use client";

export default function CategoryBar({
  categories = ["All", "Main", "Breakfast", "Drink", "Dessert"],
  selected = "All",
  onSelect,
}) {
  return (
    <nav className="category-bar" aria-label="Menu categories">
      {categories.map((cat) => {
        const isActive = (selected || "All").toLowerCase() === cat.toLowerCase();
        return (
          <button
            key={cat}
            type="button"
            className={`category-chip ${isActive ? "active" : ""}`}
            onClick={() => onSelect && onSelect(cat)}
            aria-pressed={isActive}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}
