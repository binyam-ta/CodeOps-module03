import { useState } from "react";
import PropTypes from "prop-types";
import { dishes } from "./data";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import OrderForm from "./OrderForm";

const CATEGORIES = ["All", "Main", "Breakfast", "Drink", "Dessert"];

function Menu({ initialCategory = "All" }) {
  // Category filter state
  const [category, setCategory] = useState(initialCategory);

  // Order total state in ETB (updated when dishes are added)
  const [orderTotal, setOrderTotal] = useState(0);

  // Track added items for order summary
  const [orderItems, setOrderItems] = useState([]);

  // Derived filtered dishes list based on current category state
  const filteredDishes =
    category === "All"
      ? dishes
      : dishes.filter(
          (dish) => dish.category.toLowerCase() === category.toLowerCase()
        );

  // Click handler to add dish and increment order total in ETB
  const handleAddDish = (dish) => {
    setOrderTotal((prev) => prev + dish.price);
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.name === dish.name);
      if (existing) {
        return prev.map((item) =>
          item.name === dish.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const handleClearOrder = () => {
    setOrderTotal(0);
    setOrderItems([]);
  };

  return (
    <section className="menu-section" id="menu">
      <div className="menu-intro">
        <h2 className="menu-heading">Our Menu</h2>
        <p className="menu-subtitle">
          A selection of traditional Ethiopian dishes, fresh coffee, and local
          favorites. Click dishes to add them to your TeleBirr delivery order.
        </p>
      </div>

      {/* Category Filter Chips */}
      <CategoryBar
        categories={CATEGORIES}
        selected={category}
        onSelect={setCategory}
      />

      {/* Order Total Summary Banner */}
      <div className="order-summary-bar">
        <div className="order-summary-info">
          <span className="order-summary-label">Current Order:</span>
          <span className="order-summary-count">
            {orderItems.reduce((acc, i) => acc + i.quantity, 0)} item(s)
          </span>
          <span className="order-summary-price">
            Total: <strong>{orderTotal} ETB</strong>
          </span>
        </div>
        {orderTotal > 0 && (
          <button
            type="button"
            className="order-clear-btn"
            onClick={handleClearOrder}
          >
            Clear Order
          </button>
        )}
      </div>

      {/* Filtered Dishes Grid with Empty State */}
      <DishList dishes={filteredDishes} onAdd={handleAddDish} />

      {/* TeleBirr Delivery Form */}
      <section className="order-section" id="order">
        <OrderForm
          orderTotal={orderTotal}
          onClearOrder={handleClearOrder}
        />
      </section>
    </section>
  );
}

Menu.propTypes = {
  initialCategory: PropTypes.string,
};

export default Menu;
