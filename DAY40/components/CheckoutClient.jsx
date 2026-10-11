"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import OrderForm from "./OrderForm";

export default function CheckoutClient() {
  const { totalAmount, items, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <h2 className="empty-state-title">Your Cart is Empty</h2>
          <p className="empty-state-text">
            There are no dishes in your cart to check out. Browse our authentic Ethiopian menu to add your favorites.
          </p>
          <Link href="/menu" className="hero-button">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const taxAmount = Math.round(totalAmount * 0.15);
  const grandTotal = totalAmount + taxAmount;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header-banner">
          <h2 className="checkout-page-title">TeleBirr Checkout</h2>
          <p className="checkout-welcome-msg">
            Logged in as <strong>{user?.name || "Abebe Bikila"}</strong> ({user?.email || "customer@addiseats.et"})
          </p>
        </div>

        <div className="checkout-layout">
          {/* OrderForm Column with Server Action */}
          <div className="checkout-form-column">
            <OrderForm
              items={items}
              orderTotal={totalAmount}
              onClearOrder={clearCart}
            />
          </div>

          {/* Mini order summary aside */}
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
                  <span>Tax (15%):</span>
                  <span>{taxAmount} ETB</span>
                </div>
                <div className="summary-row">
                  <span>Delivery:</span>
                  <span className="delivery-free">Free (Addis Ababa)</span>
                </div>
                <div className="summary-row total">
                  <span>Total Due:</span>
                  <strong>{grandTotal} ETB</strong>
                </div>
              </div>
              <Link href="/cart" className="edit-cart-link">
                ← Modify Cart
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
