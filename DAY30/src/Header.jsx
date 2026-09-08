import CartBadge from "./CartBadge";

function Header() {
  const restaurantName = "ADDIS CAFÉ";

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <h1 className="header-title">{restaurantName}</h1>
          <p className="header-tagline">Fresh Ethiopian Food &amp; Coffee</p>
        </div>
        <nav className="header-nav" aria-label="Main Navigation">
          <a href="#home" className="nav-link">
            Home
          </a>
          <a href="#menu" className="nav-link">
            Menu
          </a>
          <a href="#checkout" className="nav-link">
            Checkout
          </a>
          <CartBadge />
        </nav>
      </div>
    </header>
  );
}

export default Header;
