"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Dish, CartItem } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (dish: Dish, quantity?: number) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, newQuantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "addis_eats_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  // Start with empty items on both server and client to guarantee identical initial hydration
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Hydrate from localStorage once mounted on client
  useEffect(() => {
    try {
      // Check current key or legacy key
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("addis_cafe_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore storage read error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage whenever items change after initial hydration
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write error
    }
  }, [items, isLoaded]);

  const addToCart = (dish: Dish, quantity: number = 1) => {
    if (!dish) return;
    const addQty = Math.max(1, Number(quantity) || 1);

    setItems((prev) => {
      const targetId = String(dish.id);
      const targetSlug = dish.slug ? String(dish.slug).toLowerCase() : null;

      const existingIndex = prev.findIndex(
        (item) =>
          String(item.id) === targetId ||
          (targetSlug && item.slug && String(item.slug).toLowerCase() === targetSlug)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const currentItem = updated[existingIndex];
        updated[existingIndex] = {
          ...currentItem,
          quantity: (currentItem.quantity || 1) + addQty,
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: dish.id,
          slug: dish.slug,
          name: dish.name,
          price: Number(dish.price) || 0,
          description: dish.description || "",
          category: dish.category || "",
          image: dish.image || "",
          spicy: Boolean(dish.spicy),
          quantity: addQty,
        },
      ];
    });
  };

  const removeFromCart = (id: string | number) => {
    const target = String(id).toLowerCase();
    setItems((prev) =>
      prev.filter(
        (item) =>
          String(item.id).toLowerCase() !== target &&
          (!item.slug || String(item.slug).toLowerCase() !== target)
      )
    );
  };

  const updateQuantity = (id: string | number, newQuantity: number) => {
    const target = String(id).toLowerCase();
    const qty = Number(newQuantity);

    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (
          String(item.id).toLowerCase() === target ||
          (item.slug && String(item.slug).toLowerCase() === target)
        ) {
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalAmount,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
