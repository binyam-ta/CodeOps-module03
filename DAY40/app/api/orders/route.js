import { NextResponse } from "next/server";
import { validateOrderInput, createOrder } from "@/lib/orders.js";

/**
 * POST /api/orders
 * Receives JSON payload, verifies input fields and dish existence on server authority,
 * recalculates total based on server prices, and persists order.
 * 
 * Status codes:
 * - 201: Created successfully
 * - 400: Malformed JSON or invalid request format
 * - 404: Nonexistent dish referenced in items
 * - 422: Field validation failed (e.g., invalid Ethiopian phone, empty name, missing area)
 * - 500: Unexpected internal error
 */
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Request body must be valid JSON.",
        },
        { status: 400 }
      );
    }

    const { name, phone, area, items } = body || {};

    const validation = await validateOrderInput({ name, phone, area, items });

    // Nonexistent dish referenced
    if (validation.missingDishId) {
      return NextResponse.json(
        {
          error: "Dish Not Found",
          message: `Dish with ID '${validation.missingDishId}' does not exist.`,
          details: validation.errors,
        },
        { status: 404 }
      );
    }

    // Validation failed (invalid phone, empty fields, bad area)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Unprocessable Entity",
          message: "Order validation failed. Please check submitted fields.",
          details: validation.errors,
        },
        { status: 422 }
      );
    }

    // Persist verified order
    const order = await createOrder({
      customerName: validation.sanitized.customerName,
      phone: validation.sanitized.phone,
      deliveryArea: validation.sanitized.deliveryArea,
      items: validation.verifiedItems,
      subtotal: validation.calculatedSubtotal,
      tax: validation.tax,
      totalAmount: validation.totalAmount,
    });

    return NextResponse.json(
      {
        success: true,
        order,
        message: "Order placed successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders internal error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to process order. Please try again later.",
      },
      { status: 500 }
    );
  }
}
