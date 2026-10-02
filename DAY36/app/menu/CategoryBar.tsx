interface CategoryBarProps {
  categories?: string[];
  selected?: string;
  onSelect: (category: string) => void;
}

export default function CategoryBar({
  categories = ["All", "Main", "Breakfast", "Drink", "Dessert"],
  selected,
  onSelect,
}: CategoryBarProps) {
  return (
    <nav className="category-bar" aria-label="Menu categories">
      {categories.map((cat) => {
        const isActive = (selected || "All").toLowerCase() === cat.toLowerCase();
        return (
          <button
            key={cat}
            type="button"
            className={`category-chip ${isActive ? "active" : ""}`}
            onClick={() => onSelect(cat)}
            aria-pressed={isActive}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}
