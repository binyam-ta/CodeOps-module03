import { dishes, getDishes, getDishById, getTodaySpecials } from "./dishes.js";

export { dishes, getDishes, getDishById, getTodaySpecials };

export async function fetchDishes(category = "All") {
  return getDishes(category);
}

export async function fetchDishById(id) {
  return getDishById(id);
}

export default fetchDishes;
