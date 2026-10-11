"use server";

import { validateOrderInput, createOrder } from "@/lib/orders.js";

/**
 * Server Action: placeOrder
 * Handles order submission with full server-side validation and security checks.
 * Works both with standard HTML form submissions (progressive enhancement) and client calls.
 * 
 * Never trusts prices or quantities provided by the client;
 * prices are authoritatively recalculated from server data.
 */
export async function placeOrder(prevState, formData) {
  try {
    let name = "";
    let phone = "";
    let area = "";
    let items = [];

    // Support both FormData (native form submit) and direct object payloads
    if (formData instanceof FormData) {
      name = formData.get("name") || "";
      phone = formData.get("phone") || "";
      area = formData.get("area") || "";
      const rawItems = formData.get("items");
      if (typeof rawItems === "string" && rawItems.trim()) {
        try {
          items = JSON.parse(rawItems);
        } catch {
          items = [];
        }
      }
    } else if (typeof formData === "object" && formData !== null) {
      name = formData.name || "";
      phone = formData.phone || "";
      area = formData.area || "";
      items = formData.items || [];
    }

    // Execute server-side validation and re-compute authoritative pricing
    const validation = await validateOrderInput({ name, phone, area, items });

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        status: validation.missingDishId ? 404 : 422,
        message: validation.missingDishId
          ? `Nonexistent dish with ID '${validation.missingDishId}' cannot be ordered.`
          : "Server-side validation failed. Please correct the highlighted errors.",
      };
    }

    // Persist verified order into our server storage
    const orderRecord = await createOrder({
      customerName: validation.sanitized.customerName,
      phone: validation.sanitized.phone,
      deliveryArea: validation.sanitized.deliveryArea,
      items: validation.verifiedItems,
      subtotal: validation.calculatedSubtotal,
      tax: validation.tax,
      totalAmount: validation.totalAmount,
    });

    return {
      success: true,
      order: orderRecord,
      message: "Your TeleBirr order was placed successfully!",
    };
  } catch (error) {
    // Return sanitized error without leaking internal details
    console.error("Critical server error in placeOrder action:", error);
    return {
      success: false,
      errors: { general: "An unexpected server error occurred while processing your order." },
      status: 500,
      message: "An internal server error occurred.",
    };
  }
}
