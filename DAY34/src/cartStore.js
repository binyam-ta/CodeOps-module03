import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Zustand Cart Store with persist middleware.
 * Stores cart items in localStorage under the "addis-eats-cart" key.
 *
 * Actions:
 * - addItem(dish): Adds a dish to items array
 * - remove(id): Removes dish matching id
 * - clear(): Empties items array
 */
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
