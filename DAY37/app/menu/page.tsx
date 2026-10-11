import { fetchDishes } from "@/lib/api";
import MenuClient from "./MenuClient";

interface MenuPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const sp = await searchParams;

  // Deliberate throw to prove app/menu/error.js renders
  if (sp?.error === "true" || sp?.throw === "true") {
    throw new Error("Deliberate test error: Proving app/menu/error.js renders successfully!");
  }

  // Artificial delay to test and prove loading.js
  if (sp?.delay) {
    const delayVal = Array.isArray(sp.delay) ? sp.delay[0] : sp.delay;
    const ms = Math.min(Number(delayVal) || 2000, 10000);
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  const category = (Array.isArray(sp?.category) ? sp.category[0] : sp?.category) || "All";
  const dishes = await fetchDishes(category);

  return (
    <MenuClient
      initialDishes={dishes}
      initialCategory={category}
    />
  );
}
