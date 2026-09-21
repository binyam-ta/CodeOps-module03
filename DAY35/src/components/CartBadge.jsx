import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";


export function CartBadge() {
  const count = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  );
  const total = useCartStore((state) =>
    state.items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
      0
    )
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
