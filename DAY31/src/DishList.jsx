import PropTypes from "prop-types";
import Card from "./Card";
import Dish from "./Dish";

function DishList({ dishes = [], loading = false, error = null, onAdd }) {
  // loading state rendered with an early return
  if (loading) {
    return (
      <div className="menu-status-container loading">
        <div className="spinner" />
        <p className="loading-message">Loading the menu...</p>
      </div>
    );
  }

  //  error state rendered with an early return
  if (error) {
    return (
      <div className="menu-status-container error">
        <div className="error-icon">⚠️</div>
        <p className="err">{error}</p>
      </div>
    );
  }

  // Empty state rendered with a friendly message
  if (!dishes || dishes.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">No Dishes Found</p>
        <p className="empty-state-text">No dishes in this category yet.</p>
      </div>
    );
  }

  // Rendered dishes list with stable id keys
  return (
    <div className="menu-grid">
      {dishes.map((dish) => (
        <Card key={dish.id} className="menu-card">
          <Dish
            id={dish.id}
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

DishList.propTypes = {
  dishes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string,
      spicy: PropTypes.bool,
      description: PropTypes.string,
      image: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onAdd: PropTypes.func,
};

export default DishList;
