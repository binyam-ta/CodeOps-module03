import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import OrderForm from "./OrderForm";

function Checkout() {
  const { totalAmount, items, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <h2 className="empty-state-title">Your Cart is Empty</h2>
          <p className="empty-state-text">
            There are no items in your cart to check out. Browse our menu to add your favorite Ethiopian dishes.
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
          <h2 className="checkout-page-title">TeleBirr Checkout</h2>
          <p className="checkout-welcome-msg">
            Logged in as <strong>{user?.name || "Customer"}</strong> ({user?.email})
          </p>
        </div>

        <div className="checkout-layout">
          {/* OrderForm */}
          <div className="checkout-form-column">
            <OrderForm
              orderTotal={totalAmount}
              onClearOrder={clearCart}
            />
          </div>

          {/* Mini order summary */}
          <aside className="checkout-summary-column">
            <div className="checkout-summary-card">
              <h3 className="checkout-summary-title">Order Items ({items.length})</h3>
              <ul className="checkout-items-list">
                {items.map((item) => (
                  <li key={item.id} className="checkout-item-entry">
                    <span className="checkout-item-qty">{item.quantity}×</span>
                    <span className="checkout-item-name">{item.name}</span>
                    <span className="checkout-item-price">{item.price * item.quantity} ETB</span>
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
                  <span className="delivery-free">Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total Due:</span>
                  <strong>{totalAmount} ETB</strong>
                </div>
              </div>
              <Link to="/cart" className="edit-cart-link">
                ← Modify Cart
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
