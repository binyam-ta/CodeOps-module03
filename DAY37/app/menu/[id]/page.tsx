import { notFound } from "next/navigation";
import { fetchDishById } from "@/lib/api";
import DishDetail from "./DishDetail";

interface DishDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DishDetailPage({ params }: DishDetailPageProps) {
  // Read params directly from props rather than a hook
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
  }

  const dish = await fetchDishById(id);

  // If dish is not found, calling notFound() triggers app/not-found.tsx
  if (!dish) {
    notFound();
  }

  return <DishDetail dish={dish} id={id} />;
}
