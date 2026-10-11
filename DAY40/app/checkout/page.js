import CheckoutClient from "@/components/CheckoutClient.jsx";

// Forced dynamic rendering as required for the secure checkout route
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout — Addis Eats TeleBirr Delivery",
  description: "Securely complete your Addis Eats order via TeleBirr delivery in Addis Ababa.",
};

/**
 * Server Component for Checkout Route:
 * Enforces dynamic rendering on demand on the server.
 * Interactive cart consumption and order form actions are scoped to client boundaries.
 */
export default function CheckoutPage() {
  return <CheckoutClient />;
}
