import PropTypes from "prop-types";

/**
 * CategoryBar component styled after Apple Human Interface Guidelines segmented controls.
 * Features 44px accessible touch targets, keyboard navigation, and active pill indicators.
 */
function CategoryBar({
  categories = ["All", "Main", "Breakfast", "Drink", "Dessert", "Vegan"],
  selected,
  onSelect,
}) {
  return (
    <nav className="category-bar-wrapper" aria-label="Menu categories">
      <div className="category-segmented-control" role="tablist">
        {categories.map((cat) => {
          const isActive = selected.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`category-chip ${isActive ? "active" : ""}`}
              onClick={() => onSelect(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

CategoryBar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryBar;
