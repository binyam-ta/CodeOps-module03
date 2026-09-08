import { Link } from "react-router-dom";
import Hero from "./Hero";

function Home() {
  return (
    <div className="home-page">
      <Hero />

      <section className="home-intro-section">
        <div className="home-container">


          <div className="home-features">
            <div className="feature-card">
            
              <h3 className="feature-title">Authentic Buna Ceremony</h3>
              <p className="feature-text">
                Freshly roasted green coffee beans brewed in a clay jebena, accompanied by fragrant frankincense.
              </p>
            </div>

            <div className="feature-card">
             
              <h3 className="feature-title">Traditional Ethiopian Cuisine</h3>
              <p className="feature-text">
                Richly spiced wats, sizzling tibs, and freshly made teff injera cooked according to heritage recipes.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">TeleBirr Fast Delivery</h3>
              <p className="feature-text">
                Enjoy seamless ordering and payment via TeleBirr right to your doorstep across Addis Ababa.
              </p>
            </div>
          </div>

          <div className="home-cta-banner">
            <h2 className="cta-title">Explore Our Full Seasonal Menu</h2>
            <p className="cta-subtitle">
              From morning firfir to evening doro wat, taste the rich traditions of Ethiopia.
            </p>
            <div className="cta-buttons">
              <Link to="/menu" className="hero-button">
                Browse Full Menu
              </Link>
              <Link to="/menu?category=Drink" className="cta-secondary-link">
                Explore Coffee &amp; Drinks →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
