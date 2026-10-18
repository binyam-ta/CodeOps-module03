"use client";

/**
 * ==============================================================================
 * SHETA (ሽታ) - CART CONTEXT & STATE MANAGEMENT
 * ==============================================================================
 * Central React Context managing shopping cart state throughout the user journey:
 * - Adding perfumes with selected quantities.
 * - Deduplicating items: increments quantity if item already exists.
 * - Updating quantities (increment/decrement with boundary guard).
 * - Removing line items.
 * - Dynamic calculations: line item totals, overall cart subtotal, item counter.
 * - Persistence across client reloads via localStorage.
 * - Order clearing hook upon successful checkout.
 * ==============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from "react";

// Create the Context with default empty values
const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  grandTotal: 0
});

const STORAGE_KEY = "sheta_perfumes_cart_v1";

export function CartProvider({ children }) {
  // State to hold the cart items array
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initial hydration: Retrieve cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to read cart from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Persistence: Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [cart, isLoaded]);

  /**
   * Add a perfume item to the cart.
   * If the item is already present, increase its quantity instead of creating duplicate line items.
   * @param {object} product - The product object to add
   * @param {number} quantity - Number of bottles to add (defaults to 1)
   */
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // Product exists; increment quantity
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        // New product; append to cart list
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  /**
   * Update the bottle quantity for a specific product.
   * If quantity falls below 1, remove the item entirely.
   * @param {string} productId - Unique ID of product
   * @param {number} newQuantity - Desired quantity
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  /**
   * Remove a product completely from the cart.
   * @param {string} productId - Unique ID of product to remove
   */
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  /**
   * Clear all items from the cart (invoked after order placement).
   */
  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear cart storage:", error);
    }
  };

  // Dynamic calculations:
  // Total bottle count (for badges in navbar)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Exact subtotal: sum of (unit price * quantity)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Complimentary luxury shipping on orders over $150; otherwise $15 flat rate
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;

  // Standard sales tax (e.g., 5%)
  const tax = Number((subtotal * 0.05).toFixed(2));

  // Grand Total calculation
  const grandTotal = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        tax,
        shipping,
        grandTotal,
        isLoaded
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom hook for fast and typed access to the Cart context
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
