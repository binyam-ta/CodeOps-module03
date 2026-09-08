import { useCart } from "./CartProvider";

export function CartBadge() {
  const { items, total } = useCart();
  const count = items.length;

  const scrollToCheckout = () => {
    const el = document.getElementById("checkout");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      className="cart-badge-button"
      onClick={scrollToCheckout}
      aria-label={`Cart contains ${count} items, total ${total} ETB`}
    >
      <span className="cart-badge-icon" aria-hidden="true">🛒</span>
      <span className="cart-badge-count">{count}</span>
      {total > 0 && (
        <span className="cart-badge-total">{total} ETB</span>
      )}
    </button>
  );
}

export default CartBadge;
