"use client";

import { useState, useActionState, useEffect } from "react";
import { placeOrder } from "@/app/actions.js";
import { DELIVERY_AREAS, TELEBIRR_REGEX } from "@/lib/orders.js";

const initialState = {
  success: false,
  errors: null,
  order: null,
  message: null,
};

export default function OrderForm({
  items = [],
  orderTotal = 0,
  onClearOrder,
}) {
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

  const [state, formAction, isPending] = useActionState(placeOrder, initialState);

  // When order succeeds, clear the cart
  useEffect(() => {
    if (state?.success && onClearOrder) {
      onClearOrder();
    }
  }, [state?.success, onClearOrder]);

  const cleanPhone = form.phone.trim();
  const isPhoneValid = TELEBIRR_REGEX.test(cleanPhone);
  const isNameValid = form.name.trim().length >= 2;
  const isAreaValid = form.area.trim() !== "";
  const hasItems = items.length > 0;

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
  };

  if (state?.success && state.order) {
    const order = state.order;
    return (
      <div className="order-success-card">
        <div className="order-success-icon">✓</div>
        <h3 className="order-success-title">TeleBirr Order Confirmed!</h3>
        <p className="order-success-text">
          Thank you, <strong>{order.customerName}</strong>. Your order has been placed successfully.
        </p>
        <div className="order-receipt">
          <div className="receipt-row">
            <span>Order ID:</span>
            <strong>{order.id}</strong>
          </div>
          <div className="receipt-row">
            <span>Delivery Area:</span>
            <strong>{order.deliveryArea}</strong>
          </div>
          <div className="receipt-row">
            <span>TeleBirr Number:</span>
            <strong>{order.phone}</strong>
          </div>
          <div className="receipt-row">
            <span>Total Paid (incl. tax):</span>
            <strong className="receipt-total">{order.totalAmount} ETB</strong>
          </div>
          <div className="receipt-row">
            <span>Status:</span>
            <span style={{ color: "var(--success-green)", fontWeight: 700 }}>{order.status}</span>
          </div>
          <div className="receipt-row">
            <span>Placed At:</span>
            <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
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
          Complete your delivery details below to order via TeleBirr. Validation is enforced securely on the server.
        </p>
      </div>

      {state?.errors?.general && (
        <div className="field-error" style={{ marginBottom: "1rem", display: "block" }}>
          ⚠️ {state.errors.general}
        </div>
      )}
      {state?.errors?.items && (
        <div className="field-error" style={{ marginBottom: "1rem", display: "block" }}>
          ⚠️ {state.errors.items}
        </div>
      )}

      <form className="order-form" action={formAction} noValidate>
        {/* Hidden serialized items input for progressive enhancement & Server Action */}
        <input
          type="hidden"
          name="items"
          value={JSON.stringify(items.map((i) => ({ id: i.id, quantity: i.quantity })))}
        />

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
              (touched.name && !isNameValid) || state?.errors?.name ? "input-error" : ""
            }`}
            placeholder="e.g. Abebe Bikila"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {((touched.name && !isNameValid) || state?.errors?.name) && (
            <span className="field-error">
              {state?.errors?.name || "Please enter your full name (at least 2 characters)."}
            </span>
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
              (touched.phone && !isPhoneValid) || state?.errors?.phone
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
          {((touched.phone && !isPhoneValid) || state?.errors?.phone) && (
            <span className="field-error">
              {state?.errors?.phone || "Enter a valid TeleBirr number (e.g. 0911223344 or +251911223344)."}
            </span>
          )}
          {form.phone && isPhoneValid && !state?.errors?.phone && (
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
              (touched.area && !isAreaValid) || state?.errors?.area ? "input-error" : ""
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
          {((touched.area && !isAreaValid) || state?.errors?.area) && (
            <span className="field-error">
              {state?.errors?.area || "Please select a delivery neighborhood."}
            </span>
          )}
        </div>

        {/* Order Summary Line */}
        <div className="form-summary">
          <div className="form-summary-row">
            <span>Estimated Total (incl. 15% tax):</span>
            <strong className="form-summary-total">
              {Math.round(orderTotal * 1.15)} ETB
            </strong>
          </div>
          {!hasItems && (
            <p className="form-no-items-warning">
              Please add at least one dish to your cart before checking out.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending || !hasItems}
          className={`form-submit-btn ${isPending || !hasItems ? "btn-disabled" : ""}`}
        >
          {isPending
            ? "Verifying & Placing Order..."
            : hasItems
            ? `Pay ${Math.round(orderTotal * 1.15)} ETB via TeleBirr`
            : "Cart Empty — Add Dishes First"}
        </button>
      </form>
    </div>
  );
}
