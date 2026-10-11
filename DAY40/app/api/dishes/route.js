import { NextResponse } from "next/server";
import { getDishes } from "@/lib/dishes.js";

/**
 * GET /api/dishes
 * External / client HTTP API for retrieving dish listings with optional filtering.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "All";
    const search = searchParams.get("search");

    let items = await getDishes(category);

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (dish) =>
          dish.name.toLowerCase().includes(q) ||
          dish.description?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json(items, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/dishes error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to load dishes." },
      { status: 500 }
    );
  }
}
