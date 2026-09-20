import { Link } from "react-router-dom";
import Hero from "./Hero";

function Home() {
  return (
    <div className="home-page">
      <Hero />

      <section className="home-intro-section" aria-label="Café Highlights">
        <div className="home-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">Heritage &amp; Quality</span>
            <h2 className="section-title">The Addis Café Experience</h2>
            <p className="section-desc">
              From the Highlands of Yirgacheffe to the sizzling clay stoves of Bole,
              discover how we celebrate Ethiopia&apos;s rich culinary traditions.
            </p>
          </div>

          <div className="home-features-grid">
            <div className="feature-card">
              <h3 className="feature-title">Authentic Buna Ceremony</h3>
              <p className="feature-text">
                Freshly roasted green coffee beans brewed slowly in a clay jebena,
                accompanied by fragrant frankincense smoke and fresh popcorn.
              </p>
              <Link to="/menu?category=Drink" className="feature-link">
                View coffee selection →
              </Link>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Traditional Wats &amp; Tibs</h3>
              <p className="feature-text">
                Richly spiced berbere wats, sizzling prime beef and lamb tibs,
                and freshly fermented teff injera cooked according to time-honored heritage recipes.
              </p>
              <Link to="/menu?category=Main" className="feature-link">
                View main dishes →
              </Link>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">TeleBirr Instant Delivery</h3>
              <p className="feature-text">
                Enjoy seamless ordering and validated mobile payment via TeleBirr
                with prompt delivery straight to your doorstep across Addis Ababa.
              </p>
              <Link to="/checkout" className="feature-link">
                Order online now →
              </Link>
            </div>
          </div>

          <div className="home-cta-banner">
            <div className="home-cta-content">
              <span className="cta-pill">Seasonal Menu</span>
              <h2 className="cta-title">Taste the Warm Traditions of Ethiopia</h2>
              <p className="cta-subtitle">
                From morning special firfir to evening doro wat, each dish is freshly prepared with authentic spices and local ingredients.
              </p>
              <div className="cta-buttons">
                <Link to="/menu" className="hero-button cta-primary-btn">
                  Browse Full Menu
                </Link>
                <Link to="/menu?category=Drink" className="cta-secondary-link">
                  Explore Coffee &amp; Drinks →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
