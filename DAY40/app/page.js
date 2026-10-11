import Link from "next/link";
import Hero from "@/components/Hero.jsx";
import TodaySpecials from "@/components/TodaySpecials.jsx";
import { getTodaySpecials } from "@/lib/dishes.js";

export default async function HomePage() {
  const specials = await getTodaySpecials();

  return (
    <div className="home-page">
      {/* Hero branding */}
      <Hero />

      {/* Today's Specials */}
      <TodaySpecials specials={specials} />

      {/* Authentic Ethiopian Culture & Heritage Intro */}
      <section className="home-intro-section">
        <div className="home-container">
          <div className="home-features">
            <div className="feature-card">
              <h3 className="feature-title">Authentic Buna Ceremony</h3>
              <p className="feature-text">
                Freshly roasted green coffee beans brewed in a clay jebena, accompanied by fragrant frankincense and toasted popcorn.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Heritage Ethiopian Cuisine</h3>
              <p className="feature-text">
                Richly spiced wats, sizzling beef tibs, and freshly baked 100% teff injera cooked according to traditional family recipes.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">TeleBirr Fast Delivery</h3>
              <p className="feature-text">
                Enjoy seamless ordering and fast delivery right to your doorstep across Bole, Kazanchis, Piazza, and all Addis neighborhoods.
              </p>
            </div>
          </div>

          <div className="home-cta-banner">
            <h2 className="cta-title">Explore Our Full Seasonal Menu</h2>
            <p className="cta-subtitle">
              From morning firfir and chechebsa to evening doro wat and kitfo, savor the rich flavors of Ethiopia.
            </p>
            <div className="cta-buttons">
              <Link href="/menu" className="hero-button">
                Browse Full Menu
              </Link>
              <Link href="/cart" className="cta-secondary-link">
                View Shopping Cart →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
