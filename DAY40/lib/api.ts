import { dishes as fallbackDishes } from "./data";
import { Dish } from "./types";

export async function fetchDishes(
  category: string = "All",
  optionsOrSignal?: AbortSignal | { signal?: AbortSignal }
): Promise<Dish[]> {
  const signal =
    optionsOrSignal instanceof AbortSignal
      ? optionsOrSignal
      : optionsOrSignal?.signal;

  let data: Dish[] = fallbackDishes;

  if (typeof window !== "undefined") {
    try {
      const url =
        category && category !== "All"
          ? `/dishes.json?category=${encodeURIComponent(category)}`
          : "/dishes.json";

      const res = await fetch(url, { signal });
      if (res.ok) {
        data = await res.json();
      }
    } catch (err: any) {
      if (err?.name === "AbortError") throw err;
      data = fallbackDishes;
    }
  }

  if (!category || category === "All") {
    return data;
  }

  return data.filter(
    (dish) => dish.category?.toLowerCase() === category.toLowerCase()
  );
}

export async function fetchDishById(
  id: string | number,
  optionsOrSignal?: AbortSignal | { signal?: AbortSignal }
): Promise<Dish | null> {
  const all = await fetchDishes("All", optionsOrSignal);
  if (!id) return null;
  const target = String(id).toLowerCase().trim();
  return (
    all.find(
      (dish) =>
        String(dish.id).toLowerCase() === target ||
        dish.slug?.toLowerCase() === target ||
        dish.name?.toLowerCase().replace(/\s+/g, "-") === target ||
        dish.name?.toLowerCase() === target
    ) || null
  );
}

export const getDishes = fetchDishes;
export default fetchDishes;
