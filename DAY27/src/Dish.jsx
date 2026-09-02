import PropTypes from "prop-types";

function Dish({
  name,
  price,
  currency = "ETB",
  spicy = false,
  description,
  category,
  image,
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
          <span className="dish-price">
            {price} {currency}
          </span>
          <span className="dish-tax">Incl. tax: {priceWithTax} {currency}</span>
        </div>
      </div>
    </div>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  currency: PropTypes.string,
  spicy: PropTypes.bool,
  description: PropTypes.string,
  category: PropTypes.string,
  image: PropTypes.string,
};

export default Dish;
