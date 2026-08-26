function MenuItem({ name, price, description, category, image }) {
  const priceWithTax = (price * 1.15).toFixed(0);

  return (
    <div className="menu-card">
      <div className="menu-card-image">
        <img src={image} alt={name} loading="lazy" />
      </div>
      <div className="menu-card-body">
        <h3 className="menu-item-name">{name}</h3>
        <p className="menu-item-description">{description}</p>
        <div className="menu-item-footer">
          <span className="menu-item-category">{category}</span>
          <span className="menu-item-price">{price} ETB</span>
        </div>
        <p className="menu-item-tax">Incl. tax: {priceWithTax} ETB</p>
      </div>
    </div>
  );
}

export default MenuItem;
