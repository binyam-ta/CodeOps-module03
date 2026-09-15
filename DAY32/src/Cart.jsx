import { Link } from "react-router-dom";
import { useCartStore } from "./cartStore";

function Cart() {
  // Narrow selectors: strictly selecting items, remove, and clear from Zustand store
  const items = useCartStore((state) => state.items);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);

  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-container">
          <div className="cart-empty-icon">🛒</div>
          <h2 className="empty-state-title">Your Cart is Empty</h2>
          <p className="empty-state-text">
            You haven&apos;t added any dishes to your order yet. Browse our menu to discover authentic Ethiopian favorites!
          </p>
          <Link to="/menu" className="hero-button">
            Explore Our Menu
          </Link>
        </div>
      </div>
    );
  }

  const taxAmount = (total * 0.15).toFixed(0);
  const finalTotal = (total * 1.15).toFixed(0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title">Your Order Cart</h2>
          <span className="cart-item-count">{items.length} item(s)</span>
        </div>

        <div className="cart-layout">
          {/* Items List */}
          <div className="cart-items-list">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item-row">
                {item.image && (
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                )}

                <div className="cart-item-details">
                  <div className="cart-item-info">
                    <span className="dish-category">{item.category}</span>
                    <h3 className="cart-item-name">
                      <Link to={`/menu/${item.id}`}>{item.name}</Link>
                    </h3>
                    <span className="cart-item-unit-price">{item.price} ETB</span>
                  </div>

                  <div className="cart-item-controls">
                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="cart-actions-bar">
              <Link to="/menu" className="continue-shopping-link">
                ← Add More Dishes
              </Link>
              <button
                type="button"
                className="cart-clear-all-btn"
                onClick={clear}
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="cart-summary-sidebar">
            <h3 className="cart-summary-title">Order Summary</h3>

            <div className="cart-summary-lines">
              <div className="summary-line">
                <span>Subtotal ({items.length} items):</span>
                <span>{total} ETB</span>
              </div>
              <div className="summary-line">
                <span>Estimated Tax (15%):</span>
                <span>{taxAmount} ETB</span>
              </div>
              <div className="summary-line">
                <span>Delivery:</span>
                <span className="delivery-free">Free (Addis Ababa)</span>
              </div>
              <div className="summary-line total-line">
                <span>Total with Tax:</span>
                <strong className="summary-total-amount">{finalTotal} ETB</strong>
              </div>
            </div>

            <Link to="/checkout" className="checkout-btn">
              Proceed to TeleBirr Checkout →
            </Link>

            <p className="checkout-note">
              🔒 TeleBirr fast checkout. You will confirm delivery area on the next screen.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
