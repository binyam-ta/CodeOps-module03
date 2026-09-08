import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchDishById } from "./api";
import { useCart } from "./CartContext";

function DishDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

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
    addToCart(dish);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="dish-detail-container">
        <div className="menu-status-container loading">
          <div className="spinner" />
          <p className="loading-message">Loading dish details...</p>
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

  // Handle invalid/not found IDs gracefully (e.g. /menu/not-a-dish)
  if (!dish) {
    return (
      <div className="dish-detail-container">
        <div className="empty-state dish-not-found-card">
          <h2 className="empty-state-title">Dish Not Found</h2>
          <p className="empty-state-text">
            We could not find a dish matching ID &ldquo;{id}&rdquo;. Browse our full menu to find authentic Ethiopian favorites.
          </p>
          <Link to="/menu" className="hero-button not-found-back-btn">
            ← Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const priceWithTax = (dish.price * 1.15).toFixed(0);

  return (
    <div className="dish-detail-container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
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
            <span className="dish-category">{dish.category}</span>
            <h2 className="dish-detail-title">
              {dish.name}
              {Boolean(dish.spicy) && <span className="spicy-badge">• Spicy</span>}
            </h2>
          </div>

          <p className="dish-detail-desc">{dish.description}</p>

          <div className="dish-detail-pricing">
            <span className="dish-detail-price">{dish.price} ETB</span>
            <span className="dish-detail-tax">Incl. tax: {priceWithTax} ETB</span>
          </div>

          <div className="dish-detail-actions">
            <button
              type="button"
              className="hero-button add-to-cart-action-btn"
              onClick={handleAddToCart}
            >
              Add to Cart · {dish.price} ETB
            </button>
            {justAdded && (
              <span className="add-notification">
                ✓ Added to cart! <Link to="/cart">View Cart</Link>
              </span>
            )}
          </div>

          <div className="dish-detail-back">
            <Link to="/menu" className="back-to-menu-link">
              ← Back to Full Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DishDetail;
