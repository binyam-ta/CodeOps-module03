import { useState, memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Modal from "./ui/Modal";

function DishComponent({
  id,
  name,
  price,
  currency = "ETB",
  spicy = false,
  description,
  category,
  image,
  onAdd,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const priceWithTax = (price * 1.15).toFixed(0);

  const handleAdd = () => {
    if (onAdd) {
      onAdd({
        id,
        name,
        price,
        currency,
        category,
        spicy,
        description,
        image,
      });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <article className="dish-card-wrapper">
      <div className="dish">
        {image && (
          <Link
            to={`/menu/${id}`}
            className="dish-image-link"
            aria-label={`View full details for ${name}`}
          >
            <div className="dish-image">
              <img src={image} alt={name} loading="lazy" />
              <div className="dish-image-overlay">
                <span className="dish-view-hint">View Details</span>
              </div>
            </div>
          </Link>
        )}

        <div className="dish-body">
          <div className="dish-header">
            <div className="dish-tags">
              {category && <span className="dish-category-pill">{category}</span>}
              {Boolean(spicy) && (
                <span className="dish-spicy-pill" title="Traditional spicy recipe">
                  🌶️ Spicy
                </span>
              )}
            </div>

            <h3 className="dish-name">
              <Link to={`/menu/${id}`} className="dish-title-link">
                {name}
              </Link>
            </h3>
          </div>

          {description && <p className="dish-description">{description}</p>}

          <div className="dish-footer">
            <div className="dish-pricing">
              <span className="dish-price">
                {price} <span className="dish-currency">{currency}</span>
              </span>
              <span className="dish-tax">Tax incl.: {priceWithTax} {currency}</span>
            </div>

            <div className="dish-card-actions">
              <button
                type="button"
                className="dish-quickview-btn"
                onClick={() => setIsModalOpen(true)}
                aria-label={`Quick view modal for ${name}`}
              >
                Quick View
              </button>

              {onAdd && (
                <button
                  type="button"
                  className={`dish-add-btn ${justAdded ? "btn-just-added" : ""}`}
                  onClick={handleAdd}
                  aria-label={`Add ${name} to order`}
                >
                  {justAdded ? "✓ Added" : "+ Add"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Dish Modal rendered via createPortal at document.body */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={name}
      >
        <div className="dish-modal-content">
          {image && (
            <div className="dish-modal-image">
              <img src={image} alt={name} />
            </div>
          )}

          <div className="dish-modal-details">
            <div className="dish-modal-tags">
              {category && <span className="dish-category-pill">{category}</span>}
              {Boolean(spicy) && (
                <span className="dish-spicy-pill">🌶️ Spicy Heritage Recipe</span>
              )}
            </div>

            <p className="dish-modal-description">{description}</p>

            <div className="dish-modal-pricing">
              <div>
                <span className="dish-modal-price">{price} {currency}</span>
                <span className="dish-modal-tax">Total incl. 15% VAT: {priceWithTax} {currency}</span>
              </div>
              <span className="dish-delivery-tag">Free Bole Delivery</span>
            </div>

            <div className="dish-modal-actions">
              <button
                type="button"
                className="hero-button dish-modal-add-btn"
                onClick={() => {
                  handleAdd();
                  setIsModalOpen(false);
                }}
              >
                Add to Cart · {price} {currency}
              </button>
              <Link
                to={`/menu/${id}`}
                className="dish-modal-detail-link"
                onClick={() => setIsModalOpen(false)}
              >
                Open Full Page →
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </article>
  );
}

DishComponent.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  currency: PropTypes.string,
  spicy: PropTypes.bool,
  description: PropTypes.string,
  category: PropTypes.string,
  image: PropTypes.string,
  onAdd: PropTypes.func,
};

export const Dish = memo(DishComponent);
export default Dish;
