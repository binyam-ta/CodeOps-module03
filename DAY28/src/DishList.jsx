import PropTypes from "prop-types";
import Card from "./Card";
import Dish from "./Dish";

function DishList({ dishes, onAdd }) {
  if (dishes.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">No Dishes Found</p>
        <p className="empty-state-text">No dishes in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="menu-grid">
      {dishes.map((dish) => (
        <Card key={dish.id} className="menu-card">
          <Dish
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
  ).isRequired,
  onAdd: PropTypes.func,
};

export default DishList;
