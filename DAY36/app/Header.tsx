"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const { user, login, logout } = useAuth();
  
  // Track client hydration to prevent server/client HTML mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHomeActive = pathname === "/";
  const isMenuActive = pathname.startsWith("/menu");
  const isCartActive = pathname === "/cart";
  const isCheckoutActive = pathname === "/checkout";

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-brand">
          <h1 className="header-title">ADDIS CAFÉ</h1>
          <p className="header-tagline">Fresh Ethiopian Food &amp; Coffee</p>
        </Link>

        <nav className="header-nav" aria-label="Main Navigation">
          <Link
            href="/"
            className={`nav-link ${isHomeActive ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/menu"
            className={`nav-link ${isMenuActive ? "active" : ""}`}
          >
            Menu
          </Link>
          <Link
            href="/cart"
            className={`nav-link nav-cart-link ${isCartActive ? "active" : ""}`}
          >
            Cart
            {mounted && totalCount > 0 && (
              <span className="nav-cart-badge">{totalCount}</span>
            )}
          </Link>
          <Link
            href="/checkout"
            className={`nav-link ${isCheckoutActive ? "active" : ""}`}
          >
            Checkout
          </Link>

          {mounted && user ? (
            <div className="header-user-menu">
              <span className="user-greeting">Hi, {user.name.split(" ")[0]}</span>
              <button
                type="button"
                className="nav-logout-btn"
                onClick={logout}
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="nav-link nav-login-btn"
              onClick={() => login({ name: "Abebe Bikila", email: "abebe@addiscafe.et" })}
              aria-label="Quick sign in"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}