import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

function Cart() {
  const [simulateCrash, setSimulateCrash] = useState(false);

  const items = useCartStore((state) => state.items);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const clear = useCartStore((state) => state.clear);

  if (simulateCrash) {
    throw new Error(
      "Deliberate error in Cart component: Proving Error Boundary fault isolation without taking down Menu or Header."
    );
  }

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  if (itemCount === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-container">
          <div className="cart-empty-icon" aria-hidden="true">🛒</div>
          <h2 className="empty-state-title">Your Order Bag is Empty</h2>
          <p className="empty-state-text">
            Explore our traditional Ethiopian menu to add fresh wats, sizzling tibs, and wood-roasted coffee.
          </p>
          <Link to="/menu" className="hero-button">
            Browse Addis Café Menu
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
          <div>
            <span className="section-eyebrow">Order Bag</span>
            <h2 className="cart-title">Review Your Selection</h2>
          </div>
          <span className="cart-count-pill">{itemCount} item{itemCount === 1 ? "" : "s"}</span>
        </div>

        <div className="cart-layout">
          <div className="cart-items-list" role="list" aria-label="Cart items">
            {items.map((item) => (
              <div key={item.id} className="cart-item-row" role="listitem">
                {item.image && (
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                )}

                <div className="cart-item-details">
                  <div className="cart-item-info">
                    <span className="dish-category-pill">{item.category}</span>
                    <h3 className="cart-item-name">
                      <Link to={`/menu/${item.id}`}>{item.name}</Link>
                    </h3>
                    <span className="cart-item-unit-price">{item.price} ETB each</span>
                  </div>

                  <div className="cart-item-controls">
                    <div className="quantity-stepper" aria-label={`${item.name} quantity selector`}>
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => decrementItem(item.id)}
                        aria-label={`Decrease ${item.name} quantity`}
                        disabled={(item.quantity || 1) <= 1}
                      >
                        −
                      </button>
                      <span className="stepper-value" aria-live="polite">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => addItem(item, 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove all ${item.name} from bag`}
                    >
                      ✕ Remove All
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
                Clear Entire Bag
              </button>
            </div>
          </div>

          <aside className="cart-summary-sidebar" aria-label="Order summary">
            <h3 className="cart-summary-title">Summary</h3>

            <div className="cart-summary-lines">
              <div className="summary-line">
                <span>Subtotal ({itemCount} items):</span>
                <span>{total} ETB</span>
              </div>
              <div className="summary-line">
                <span>Estimated VAT (15%):</span>
                <span>{taxAmount} ETB</span>
              </div>
              <div className="summary-line">
                <span>Delivery (Addis Ababa):</span>
                <span className="delivery-free">Free</span>
              </div>
              <div className="summary-line total-line">
                <span>Total Due:</span>
                <strong className="summary-total-amount">{finalTotal} ETB</strong>
              </div>
            </div>

            <Link to="/checkout" className="checkout-btn">
              Proceed to TeleBirr Checkout →
            </Link>

            <p className="checkout-note">
              🔒 Fast TeleBirr Mobile Payment. Confirm address details on next step.
            </p>
          </aside>
        </div>

        <div className="dev-test-bar">
          <span className="dev-test-label">Resilience Testing:</span>
          <button
            type="button"
            className="simulate-crash-btn"
            onClick={() => setSimulateCrash(true)}
            title="Simulate runtime crash in Cart to verify Error Boundary fault isolation"
          >
            ⚡ Simulate Cart Crash
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
