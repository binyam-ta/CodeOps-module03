"use client";

import { useEffect } from "react";
import Link from "next/link";

interface MenuErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MenuError({ error, reset }: MenuErrorProps) {
  useEffect(() => {
    console.error("Menu segment error captured by error.js:", error);
  }, [error]);

  return (
    <div
      className="menu-status-container error"
      style={{
        minHeight: "45vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "3rem auto",
        padding: "2.5rem 2rem",
      }}
    >
      <div className="error-icon" style={{ fontSize: "2.5rem" }}>⚠️</div>
      <h2 style={{ color: "var(--spicy-red)", marginTop: "0.5rem" }}>Something went wrong!</h2>
      <p className="err" style={{ textAlign: "center", margin: "0.5rem 0 1.5rem" }}>
        {error?.message || "Could not load the Addis Café menu. Please try again."}
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        {reset && (
          <button
            type="button"
            className="hero-button"
            onClick={() => reset()}
          >
            Try Again
          </button>
        )}
        <Link href="/menu" className="cta-secondary-link" style={{ padding: "0.75rem 1.5rem" }}>
          Reload Menu
        </Link>
        <Link href="/" className="hero-button" style={{ background: "var(--green)" }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}
