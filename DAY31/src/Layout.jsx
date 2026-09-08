import { Outlet, NavLink, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import Footer from "./Footer";

function Layout() {
  const { totalCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
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
              className={({ isActive }) => `nav-link nav-cart-link ${isActive ? "active" : ""}`}
            >
              Cart
              {totalCount > 0 && <span className="nav-cart-badge">{totalCount}</span>}
            </NavLink>
            <NavLink
              to="/checkout"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Checkout
            </NavLink>

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

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
