import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (dish, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === dish.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === dish.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { ...dish, quantity }],
          };
        }),
      decrementItem: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "addis-eats-cart",
    }
  )
);

export default useCartStore;
