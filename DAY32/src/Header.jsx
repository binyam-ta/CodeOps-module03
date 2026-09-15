import { NavLink, Link } from "react-router-dom";
import CartBadge from "./CartBadge";
import { useAuth } from "./useAuth";
import { useTheme } from "./useTheme";

/**
 * Header component.
 * Does NOT subscribe to cart state directly, ensuring adding a dish only re-renders CartBadge!
 */
function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          <h1 className="header-title">ADDIS CAFÉ</h1>
          <p className="header-tagline">Fresh Ethiopian Food &amp; Coffee</p>
        </Link>

        <nav className="header-nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Menu
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Cart
          </NavLink>
          <NavLink
            to="/checkout"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Checkout
          </NavLink>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Current: ${theme} theme`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* CartBadge: Only component that re-renders on cart additions */}
          <CartBadge />

          {/* Auth Session */}
          {user ? (
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
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-link nav-login-btn ${isActive ? "active" : ""}`}
            >
              Sign In
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
