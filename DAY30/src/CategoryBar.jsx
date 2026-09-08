import PropTypes from "prop-types";

function CategoryBar({
  categories = ["All", "Main", "Breakfast", "Drink", "Dessert"],
  selected,
  onSelect,
}) {
  return (
    <nav className="category-bar" aria-label="Menu categories">
      {categories.map((cat) => {
        const isActive = selected.toLowerCase() === cat.toLowerCase();
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

CategoryBar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryBar;
