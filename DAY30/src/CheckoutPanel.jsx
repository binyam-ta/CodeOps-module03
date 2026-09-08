import { useState } from "react";
import { useCart } from "./CartProvider";

const DELIVERY_AREAS = [
  "Bole",
  "Kazanchis",
  "Piazza",
  "Sarbet",
  "Old Airport",
  "Gerji",
  "CMC",
  "Mexico",
  "Arat Kilo",
];

const TELEBIRR_REGEX = /^(?:\+251|0)[97]\d{8}$/;

export function CheckoutPanel() {
  const { items, total, removeFromCart, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    area: false,
  });

  const [receipt, setReceipt] = useState(null);

  const cleanPhone = form.phone.trim();
  const isPhoneValid = TELEBIRR_REGEX.test(cleanPhone);
  const isNameValid = form.name.trim().length >= 2;
  const isAreaValid = form.area.trim() !== "";
  const hasItems = items.length > 0 && total > 0;
  const isFormValid = isPhoneValid && isNameValid && isAreaValid && hasItems;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const orderReceipt = {
      orderId: `ET-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: form.name.trim(),
      phone: cleanPhone,
      deliveryArea: form.area,
      items: [...items],
      totalAmount: total,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setReceipt(orderReceipt);
    clearCart();
  };

  const handleReset = () => {
    setForm({ name: "", phone: "", area: "" });
    setTouched({ name: false, phone: false, area: false });
    setReceipt(null);
  };

  return (
    <section className="checkout-panel-section" id="checkout">
      <div className="checkout-panel-container">
        <div className="checkout-panel-header">
          <h2 className="checkout-panel-title">TeleBirr Checkout Panel</h2>
          <p className="checkout-panel-subtitle">
            Review your selected dishes and enter your delivery details.
          </p>
        </div>

        {receipt ? (
          <div className="order-success-card">
            <div className="order-success-icon">✓</div>
            <h3 className="order-success-title">TeleBirr Order Confirmed!</h3>
            <p className="order-success-text">
              Thank you, <strong>{receipt.customerName}</strong>. Your payment of{" "}
              <strong>{receipt.totalAmount} ETB</strong> has been received via TeleBirr.
            </p>
            <div className="order-receipt">
              <div className="receipt-row">
                <span>Order Ref:</span>
                <strong>{receipt.orderId}</strong>
              </div>
              <div className="receipt-row">
                <span>Delivery Area:</span>
                <strong>{receipt.deliveryArea}</strong>
              </div>
              <div className="receipt-row">
                <span>TeleBirr Phone:</span>
                <strong>{receipt.phone}</strong>
              </div>
              <div className="receipt-row">
                <span>Items Ordered:</span>
                <span>{receipt.items.length} item(s)</span>
              </div>
              <div className="receipt-row">
                <span>Total Paid:</span>
                <strong className="receipt-total">{receipt.totalAmount} ETB</strong>
              </div>
            </div>
            <button
              type="button"
              className="order-reset-btn"
              onClick={handleReset}
            >
              Place Another Order
            </button>
          </div>
        ) : (
          <div className="checkout-panel-layout">
            {/* Cart Items List in Checkout Panel */}
            <div className="checkout-cart-summary">
              <div className="checkout-summary-top">
                <h3 className="checkout-subheading">
                  Your Cart ({items.length} {items.length === 1 ? "item" : "items"})
                </h3>
                {items.length > 0 && (
                  <button
                    type="button"
                    className="cart-clear-all-btn"
                    onClick={clearCart}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="empty-cart-message">
                  <p>Your cart is currently empty.</p>
                  <a href="#menu" className="browse-menu-link">
                    Browse menu to add dishes →
                  </a>
                </div>
              ) : (
                <ul className="checkout-items-list">
                  {items.map((dish, index) => (
                    <li key={`${dish.id}-${index}`} className="checkout-item-entry">
                      <div className="checkout-item-info">
                        <span className="checkout-item-name">{dish.name}</span>
                        <span className="checkout-item-category">{dish.category}</span>
                      </div>
                      <div className="checkout-item-side">
                        <span className="checkout-item-price">{dish.price} ETB</span>
                        <button
                          type="button"
                          className="item-remove-btn"
                          onClick={() => removeFromCart(dish.id)}
                          aria-label={`Remove ${dish.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="checkout-total-row">
                <span>Total Amount:</span>
                <strong className="checkout-total-number">{total} ETB</strong>
              </div>
            </div>

            {/* Delivery Details Form */}
            <form className="checkout-form" onSubmit={handleSubmit} noValidate>
              <h3 className="checkout-subheading">Delivery Details</h3>

              <div className="form-group">
                <label htmlFor="customer-name" className="form-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="customer-name"
                  name="name"
                  type="text"
                  className={`form-input ${
                    touched.name && !isNameValid ? "input-error" : ""
                  }`}
                  placeholder="e.g. Abebe Bikila"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.name && !isNameValid && (
                  <span className="field-error">Please enter at least 2 characters.</span>
                )}
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="customer-phone" className="form-label">
                    TeleBirr Number <span className="required-star">*</span>
                  </label>
                  <span className="field-hint">0911223344 or +251911223344</span>
                </div>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  className={`form-input ${
                    touched.phone && !isPhoneValid
                      ? "input-error"
                      : form.phone && isPhoneValid
                      ? "input-valid"
                      : ""
                  }`}
                  placeholder="0911223344 or +251911223344"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.phone && !isPhoneValid && (
                  <span className="field-error">
                    Enter a valid TeleBirr number (09xxxxxxxx or +2519xxxxxxxx).
                  </span>
                )}
                {form.phone && isPhoneValid && (
                  <span className="field-success">✓ Valid TeleBirr number</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="customer-area" className="form-label">
                  Delivery Neighborhood <span className="required-star">*</span>
                </label>
                <select
                  id="customer-area"
                  name="area"
                  className={`form-select ${
                    touched.area && !isAreaValid ? "input-error" : ""
                  }`}
                  value={form.area}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">Select your area...</option>
                  {DELIVERY_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                {touched.area && !isAreaValid && (
                  <span className="field-error">Please select a delivery neighborhood.</span>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`form-submit-btn ${!isFormValid ? "btn-disabled" : ""}`}
              >
                {hasItems
                  ? `Confirm & Pay ${total} ETB via TeleBirr`
                  : "Add Dishes to Enable Order"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default CheckoutPanel;
