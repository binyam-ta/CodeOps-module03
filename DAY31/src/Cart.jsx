import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalCount, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-container">
          <div className="cart-empty-icon">🛒</div>
          <h2 className="empty-state-title">Your Cart is Empty</h2>
          <p className="empty-state-text">
            You have not added any dishes to your order yet. Explore our delicious menu to get started!
          </p>
          <Link to="/menu" className="hero-button">
            Explore Our Menu
          </Link>
        </div>
      </div>
    );
  }

  const taxAmount = (totalAmount * 0.15).toFixed(0);
  const finalTotal = (totalAmount * 1.15).toFixed(0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title">Your Order Cart</h2>
          <span className="cart-item-count">{totalCount} item(s)</span>
        </div>

        <div className="cart-layout">
          {/* Items List */}
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-info">
                    <span className="dish-category">{item.category}</span>
                    <h3 className="cart-item-name">
                      <Link to={`/menu/${item.id}`}>{item.name}</Link>
                    </h3>
                    <span className="cart-item-unit-price">{item.price} ETB each</span>
                  </div>

                  <div className="cart-item-controls">
                    <div className="quantity-selector">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-subtotal">
                      <strong>{item.price * item.quantity} ETB</strong>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="cart-actions-bar">
              <Link to="/menu" className="continue-shopping-link">
                ← Continue Shopping
              </Link>
              <button
                type="button"
                className="cart-clear-all-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="cart-summary-sidebar">
            <h3 className="cart-summary-title">Order Summary</h3>

            <div className="cart-summary-lines">
              <div className="summary-line">
                <span>Subtotal ({totalCount} items):</span>
                <span>{totalAmount} ETB</span>
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
              🔒 Safe &amp; fast TeleBirr checkout. You will confirm delivery details on the next screen.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
