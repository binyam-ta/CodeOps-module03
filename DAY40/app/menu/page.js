import { getDishes } from "@/lib/dishes.js";
import MenuClient from "@/components/MenuClient.jsx";

// Incremental Static Regeneration (ISR) with a 1-hour (3600s) revalidation interval
export const revalidate = 3600;

/**
 * Menu Page: Asynchronous Server Component.
 * Fetches menu data directly from the server-side data access layer (lib/dishes.js).
 * Interactive category filtering and cart additions are delegated to MenuClient.
 */
export default async function MenuPage() {
  const dishes = await getDishes("All");

  return <MenuClient initialDishes={dishes} />;
}
