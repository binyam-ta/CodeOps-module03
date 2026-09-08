import PropTypes from "prop-types";

function Dish({
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
  const priceWithTax = (price * 1.15).toFixed(0);

  return (
    <div className="dish">
      {image && (
        <div className="dish-image">
          <img src={image} alt={name} loading="lazy" />
        </div>
      )}
      <div className="dish-body">
        <div className="dish-header">
          <h3 className="dish-name">
            {name} {Boolean(spicy) && <span className="spicy-badge">• Spicy</span>}
          </h3>
          {category && <span className="dish-category">{category}</span>}
        </div>
        {description && <p className="dish-description">{description}</p>}
        <div className="dish-footer">
          <div className="dish-pricing">
            <span className="dish-price">
              {price} {currency}
            </span>
            <span className="dish-tax">Incl. tax: {priceWithTax} {currency}</span>
          </div>
          {onAdd && (
            <button
              type="button"
              className="dish-add-btn"
              onClick={() =>
                onAdd({
                  id,
                  name,
                  price,
                  currency,
                  category,
                  spicy,
                  description,
                  image,
                })
              }
              aria-label={`Add ${name} to cart`}
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Dish.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  currency: PropTypes.string,
  spicy: PropTypes.bool,
  description: PropTypes.string,
  category: PropTypes.string,
  image: PropTypes.string,
  onAdd: PropTypes.func,
};

export default Dish;
