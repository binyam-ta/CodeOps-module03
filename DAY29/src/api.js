export async function fetchDishes(category = "All", optionsOrSignal) {
  const signal =
    optionsOrSignal instanceof AbortSignal
      ? optionsOrSignal
      : optionsOrSignal?.signal;

  const url =
    category && category !== "All"
      ? `/dishes.json?category=${encodeURIComponent(category)}`
      : "/dishes.json";

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(
      `Could not load the menu (${res.status} ${res.statusText || "Not Found"}). Please check if dishes.json is available.`
    );
  }

  const data = await res.json();

  if (!category || category === "All") {
    return data;
  }

  return data.filter(
    (dish) => dish.category.toLowerCase() === category.toLowerCase()
  );
}

export const getDishes = fetchDishes;
export default fetchDishes;
