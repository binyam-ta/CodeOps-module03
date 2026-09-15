import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (dish) =>
        set((state) => ({
          items: [...state.items, dish],
        })),
      remove: (id) =>
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
