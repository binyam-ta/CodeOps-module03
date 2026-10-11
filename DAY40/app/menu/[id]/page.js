import { notFound } from "next/navigation";
import { getDishes, getDishById } from "@/lib/dishes.js";
import DishDetail from "@/components/DishDetail.jsx";

/**
 * Pre-render known dish IDs and slugs at build time.
 */
export async function generateStaticParams() {
  const allDishes = await getDishes("All");
  const params = [];

  for (const dish of allDishes) {
    params.push({ id: String(dish.id) });
    if (dish.slug) {
      params.push({ id: dish.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const dish = await getDishById(resolvedParams?.id);
  if (!dish) {
    return {
      title: "Dish Not Found — Addis Eats",
    };
  }
  return {
    title: `${dish.name} — Addis Eats`,
    description: dish.description,
  };
}

/**
 * Dynamic Dish Route:
 * Uses generateStaticParams() to statically generate known pages.
 * Invokes notFound() if an unknown dish ID is requested.
 */
export default async function DishDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
  }

  const dish = await getDishById(id);

  if (!dish) {
    notFound();
  }

  return <DishDetail dish={dish} />;
}
