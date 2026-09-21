import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchDishById } from "../utils/api";
import { useCartStore } from "../store/cartStore";

/**
 * Dynamic route component for /menu/:id reading ID parameter via useParams.
 * Follows Apple HIG product detail layout with high visual clarity and accessible actions.
 */
function DishDetail() {
  const { id } = useParams();

  // Narrow selector: only selects addItem action; never re-renders on items array changes
  const addItem = useCartStore((state) => state.addItem);

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [justAdded, setJustAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDish() {
      setLoading(true);
      setError(null);
      try {
        const foundDish = await fetchDishById(id, controller.signal);
        setDish(foundDish);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load dish details.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDish();

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!dish) return;
    addItem(dish, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="dish-detail-container">
        <div className="menu-status-container loading">
          <div className="spinner" />
          <p className="loading-message">Preparing dish presentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dish-detail-container">
        <div className="menu-status-container error">
          <p className="err">{error}</p>
          <Link to="/menu" className="back-to-menu-link">
            ← Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  // Gracefully handle not found IDs (e.g. /menu/not-a-dish) without crashing
  if (!dish) {
    return (
      <div className="dish-detail-container">
        <div className="empty-state dish-not-found-card">
          <span className="not-found-icon" aria-hidden="true">🍲</span>
          <h2 className="empty-state-title">Dish Not Found</h2>
          <p className="empty-state-text">
            We could not find a dish matching ID &ldquo;{id}&rdquo;. Browse our full catalog to discover traditional Ethiopian favorites.
          </p>
          <Link to="/menu" className="hero-button not-found-back-btn">
            ← Back to Full Menu
          </Link>
        </div>
      </div>
    );
  }

  const priceWithTax = (dish.price * 1.15).toFixed(0);

  return (
    <div className="dish-detail-container">
      <nav className="breadcrumb" aria-label="Breadcrumb Navigation">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to="/menu">Menu</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{dish.name}</span>
      </nav>

      <div className="dish-detail-card">
        <div className="dish-detail-image-wrapper">
          <img src={dish.image} alt={dish.name} className="dish-detail-image" />
        </div>

        <div className="dish-detail-info">
          <div className="dish-detail-header">
            <div className="dish-tags">
              <span className="dish-category-pill">{dish.category}</span>
              {Boolean(dish.spicy) && (
                <span className="dish-spicy-pill">🌶️ Authentic Spicy Recipe</span>
              )}
            </div>

            <h2 className="dish-detail-title">{dish.name}</h2>
          </div>

          <p className="dish-detail-desc">{dish.description}</p>

          <div className="dish-detail-pricing">
            <div className="pricing-primary-group">
              <span className="dish-detail-price">{dish.price} ETB</span>
              <span className="dish-detail-tax">Incl. 15% VAT: {priceWithTax} ETB</span>
            </div>
            <div className="dish-detail-perks">
              <span className="perk-badge">✓ Teff Injera Included</span>
              <span className="perk-badge">✓ Fresh Daily Preparation</span>
            </div>
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="dish-detail-actions">
            <div className="quantity-stepper" aria-label="Quantity selector">
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="stepper-value" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={`hero-button add-to-cart-action-btn ${justAdded ? "btn-just-added" : ""}`}
              onClick={handleAddToCart}
            >
              {justAdded
                ? "✓ Added to Order!"
                : `Add ${quantity} to Order · ${dish.price * quantity} ETB`}
            </button>
          </div>

          {justAdded && (
            <div className="add-notification-banner" role="status">
              <span>Item added to cart!</span>
              <Link to="/cart" className="view-cart-link">
                View Cart &amp; Checkout →
              </Link>
            </div>
          )}

          <div className="dish-detail-back">
            <Link to="/menu" className="back-to-menu-link">
              ← Return to Full Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DishDetail;
