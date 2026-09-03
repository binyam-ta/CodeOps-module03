function Header() {
  const restaurantName = "ADDIS CAFÉ";

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <h1 className="header-title">{restaurantName}</h1>
          <p className="header-tagline">Fresh Ethiopian Food &amp; Coffee</p>
        </div>
        <nav className="header-nav">
          <a href="#home" className="nav-link">Home</a>
          <a href="#menu" className="nav-link">Menu</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
