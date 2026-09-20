import { Link } from "react-router-dom";
import { useCartStore } from "./cartStore";
import { useAuth } from "./useAuth";
import OrderForm from "./OrderForm";

/**
 * Checkout screen guarded by RequireAuth.
 * Follows Apple HIG grouped form layout with high clarity, immediate feedback, and tactile CTA.
 */
function Checkout() {
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const { user } = useAuth();

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <span className="not-found-icon" aria-hidden="true">🛒</span>
          <h2 className="empty-state-title">Your Order Bag is Empty</h2>
          <p className="empty-state-text">
            There are no items in your cart to checkout. Browse our traditional menu to add authentic dishes.
          </p>
          <Link to="/menu" className="hero-button">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header-banner">
          <div>
            <span className="section-eyebrow">Secure Checkout</span>
            <h2 className="checkout-page-title">TeleBirr Payment &amp; Delivery</h2>
          </div>
          <div className="checkout-auth-badge">
            <span className="auth-avatar-glyph">👤</span>
            <div>
              <span className="auth-badge-name">{user?.name || "Customer"}</span>
              <span className="auth-badge-email">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="checkout-layout">
          {/* OrderForm Column */}
          <div className="checkout-form-column">
            <OrderForm
              orderTotal={totalAmount}
              onClearOrder={clear}
            />
          </div>

          {/* Mini Order Summary Sidebar */}
          <aside className="checkout-summary-column" aria-label="Order review">
            <div className="checkout-summary-card">
              <div className="checkout-summary-header">
                <h3 className="checkout-summary-title">Order Items</h3>
                <span className="cart-count-pill">{items.length}</span>
              </div>

              <ul className="checkout-items-list" role="list">
                {items.map((item, idx) => (
                  <li key={`${item.id}-${idx}`} className="checkout-item-entry" role="listitem">
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      <span className="checkout-item-category-tag">{item.category}</span>
                    </div>
                    <span className="checkout-item-price">{item.price} ETB</span>
                  </li>
                ))}
              </ul>

              <div className="checkout-summary-footer">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{totalAmount} ETB</span>
                </div>
                <div className="summary-row">
                  <span>Delivery:</span>
                  <span className="delivery-free">Free (Addis Ababa)</span>
                </div>
                <div className="summary-row total">
                  <span>Total Due:</span>
                  <strong>{totalAmount} ETB</strong>
                </div>
              </div>

              <Link to="/cart" className="edit-cart-link">
                ← Modify Items in Cart
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
