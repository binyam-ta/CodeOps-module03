import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout component acting as the persistent outer frame.
 * Renders the persistent Header (with active NavLink highlight, CartBadge, and auth status),
 * the router Outlet for child screens, and the Footer.
 */
function Layout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
