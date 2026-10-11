import { getDishById } from "./dishes.js";

export const DELIVERY_AREAS = [
  "Bole",
  "Kazanchis",
  "Piazza",
  "Sarbet",
  "Old Airport",
  "Gerji",
  "CMC",
  "Mexico",
  "Arat Kilo",
];

export const TELEBIRR_REGEX = /^(?:\+251|0)[97]\d{8}$/;

/**
 * In-memory development persistence store for orders.
 * NOTE: For development and assessment demonstration only.
 * Limitations: Data is reset upon server restart and does not scale across serverless instances.
 */
const inMemoryOrders = [];

/**
 * Validate order input fields.
 * Returns { isValid, errors, verifiedItems, calculatedTotal }
 */
export async function validateOrderInput({ name, phone, area, items }) {
  const errors = {};

  const cleanName = typeof name === "string" ? name.trim() : "";
  if (!cleanName || cleanName.length < 2) {
    errors.name = "Full name is required (minimum 2 characters).";
  }

  const cleanPhone = typeof phone === "string" ? phone.trim() : "";
  if (!cleanPhone || !TELEBIRR_REGEX.test(cleanPhone)) {
    errors.phone = "Invalid Ethiopian TeleBirr phone number (e.g. 0911223344 or +251911223344).";
  }

  const cleanArea = typeof area === "string" ? area.trim() : "";
  if (!cleanArea || !DELIVERY_AREAS.includes(cleanArea)) {
    errors.area = `Delivery area must be one of: ${DELIVERY_AREAS.join(", ")}.`;
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.items = "Order must contain at least one item.";
  }

  // Verify dish existence and re-calculate price from server authority (Never trust client prices)
  const verifiedItems = [];
  let calculatedSubtotal = 0;
  let missingDishId = null;

  if (Array.isArray(items) && items.length > 0) {
    for (const item of items) {
      const dish = await getDishById(item.id);
      if (!dish) {
        missingDishId = item.id;
        errors.items = `Dish with ID '${item.id}' was not found in our menu.`;
        break;
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        errors.items = `Invalid quantity for dish '${dish.name}'.`;
        break;
      }

      verifiedItems.push({
        id: dish.id,
        name: dish.name,
        price: dish.price, // Authoritative server price
        quantity: qty,
        itemTotal: dish.price * qty,
      });

      calculatedSubtotal += dish.price * qty;
    }
  }

  const tax = Math.round(calculatedSubtotal * 0.15);
  const totalAmount = calculatedSubtotal + tax;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    missingDishId,
    verifiedItems,
    calculatedSubtotal,
    tax,
    totalAmount,
    sanitized: {
      customerName: cleanName,
      phone: cleanPhone,
      deliveryArea: cleanArea,
    },
  };
}

/**
 * Persist an order to our development store.
 */
export async function createOrder(orderPayload) {
  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const order = {
    id: orderId,
    ...orderPayload,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  };

  inMemoryOrders.unshift(order);
  return order;
}

/**
 * Retrieve all persisted orders (development debugging).
 */
export async function getOrders() {
  return inMemoryOrders;
}
