import { useState } from "react";
import PropTypes from "prop-types";

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

function OrderForm({ orderTotal, onOrderSuccess, onClearOrder }) {
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

  const [submittedOrder, setSubmittedOrder] = useState(null);

  const cleanPhone = form.phone.trim();
  const isPhoneValid = TELEBIRR_REGEX.test(cleanPhone);
  const isNameValid = form.name.trim().length >= 2;
  const isAreaValid = form.area.trim() !== "";
  const hasItems = orderTotal > 0;
  const isFormValid = isPhoneValid && isNameValid && isAreaValid && hasItems;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Controlled update copying state with the object spread operator
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

    const orderDetails = {
      customerName: form.name.trim(),
      phone: cleanPhone,
      deliveryArea: form.area,
      totalAmount: orderTotal,
      orderTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setSubmittedOrder(orderDetails);

    if (onOrderSuccess) {
      onOrderSuccess(orderDetails);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      phone: "",
      area: "",
    });
    setTouched({
      name: false,
      phone: false,
      area: false,
    });
    setSubmittedOrder(null);
    if (onClearOrder) {
      onClearOrder();
    }
  };

  if (submittedOrder) {
    return (
      <div className="order-success-card">
        <div className="order-success-icon">✓</div>
        <h3 className="order-success-title">TeleBirr Order Confirmed!</h3>
        <p className="order-success-text">
          Thank you, <strong>{submittedOrder.customerName}</strong>. Your order has been placed successfully.
        </p>
        <div className="order-receipt">
          <div className="receipt-row">
            <span>Delivery Area:</span>
            <strong>{submittedOrder.deliveryArea}</strong>
          </div>
          <div className="receipt-row">
            <span>TeleBirr Number:</span>
            <strong>{submittedOrder.phone}</strong>
          </div>
          <div className="receipt-row">
            <span>Total Paid:</span>
            <strong className="receipt-total">{submittedOrder.totalAmount} ETB</strong>
          </div>
          <div className="receipt-row">
            <span>Time:</span>
            <span>{submittedOrder.orderTime}</span>
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
    );
  }

  return (
    <div className="order-form-container">
      <div className="order-form-header">
        <h3 className="order-form-title">TeleBirr Delivery Details</h3>
        <p className="order-form-subtitle">
          Complete your delivery details below to order via TeleBirr.
        </p>
      </div>

      <form className="order-form" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name <span className="required-star">*</span>
          </label>
          <input
            id="name"
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
            <span className="field-error">Please enter your full name (at least 2 characters).</span>
          )}
        </div>

        {/* TeleBirr Phone Number */}
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="phone" className="form-label">
              TeleBirr Mobile Number <span className="required-star">*</span>
            </label>
            <span className="field-hint">e.g. 0911223344 or +251911223344</span>
          </div>
          <input
            id="phone"
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
              Enter a valid TeleBirr number (e.g. 0911223344 or +251911223344).
            </span>
          )}
          {form.phone && isPhoneValid && (
            <span className="field-success">✓ Valid TeleBirr number</span>
          )}
        </div>

        {/* Delivery Area */}
        <div className="form-group">
          <label htmlFor="area" className="form-label">
            Delivery Area <span className="required-star">*</span>
          </label>
          <select
            id="area"
            name="area"
            className={`form-select ${
              touched.area && !isAreaValid ? "input-error" : ""
            }`}
            value={form.area}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          >
            <option value="">Select your neighborhood...</option>
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

        {/* Order Summary Line */}
        <div className="form-summary">
          <div className="form-summary-row">
            <span>Current Order Total:</span>
            <strong className="form-summary-total">{orderTotal} ETB</strong>
          </div>
          {!hasItems && (
            <p className="form-no-items-warning">
              Please add at least one dish to your order above before checking out.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`form-submit-btn ${!isFormValid ? "btn-disabled" : ""}`}
        >
          {hasItems
            ? `Pay ${orderTotal} ETB via TeleBirr`
            : "Add Items to Enable Checkout"}
        </button>
      </form>
    </div>
  );
}

OrderForm.propTypes = {
  orderTotal: PropTypes.number.isRequired,
  onOrderSuccess: PropTypes.func,
  onClearOrder: PropTypes.func,
};

export default OrderForm;
