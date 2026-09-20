import { Link } from "react-router-dom";
import { useCartStore } from "./cartStore";

/**
 * CartBadge component reading state through narrow selectors.
 * No bare useCartStore() calls — only subscribes to item count and total.
 */
export function CartBadge() {
  // Narrow selectors: only re-renders when count or total actually changes
  const count = useCartStore((state) => state.items.length);
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
  );

  return (
    <Link
      to="/cart"
      className="cart-badge-button"
      aria-label={`Cart contains ${count} items, total ${total} ETB`}
    >
      <span className="cart-badge-icon" aria-hidden="true">🛒</span>
      <span className="cart-badge-count">{count}</span>
      {total > 0 && <span className="cart-badge-total">{total} ETB</span>}
    </Link>
  );
}

export default CartBadge;
