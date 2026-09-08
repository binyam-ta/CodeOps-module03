import { createContext, useContext, useReducer, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { cartReducer, initialCartState } from "./cartReducer";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const total = useMemo(
    () => state.items.reduce((sum, dish) => sum + (Number(dish.price) || 0), 0),
    [state.items]
  );

  const addToCart = useCallback((dish) => {
    dispatch({ type: "add", dish });
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: "remove", id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const value = useMemo(
    () => ({
      items: state.items,
      dispatch,
      total,
      addToCart,
      removeFromCart,
      clearCart,
    }),
    [state.items, total, addToCart, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartProvider;
