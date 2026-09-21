import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay">
        <div className="hero-content">

          <h2 className="hero-heading">
            Authentic Flavor.<br />Time-Honored Buna.
          </h2>

          <p className="hero-subtext">
            Experience traditional Ethiopian recipes, wood-roasted coffee ceremonies,
            and freshly baked teff injera delivered right to your table.
          </p>

          <div className="hero-actions">
            <Link to="/menu" className="hero-button">
              Explore Our Menu →
            </Link>
            <Link to="/menu?category=Drink" className="hero-secondary-button">
              Coffee &amp; Buna Ceremony
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
