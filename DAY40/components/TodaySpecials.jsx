import Link from "next/link";
import Card from "./Card";

export default function TodaySpecials({ specials = [] }) {
  if (!specials || specials.length === 0) return null;

  return (
    <section className="specials-section" style={{ padding: "3rem 1.5rem", background: "var(--cream)" }}>
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span style={{ color: "var(--gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", fontSize: "0.85rem" }}>
            Chef's Highlights
          </span>
          <h2 style={{ fontSize: "2rem", color: "var(--green-dark)", marginTop: "0.25rem" }}>
            Today's Addis Specials
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0.5rem auto 0" }}>
            Handpicked heritage recipes slow-simmered daily with fresh teff injera and berbere spice.
          </p>
        </div>

        <div className="menu-grid">
          {specials.map((dish) => (
            <Card key={dish.id} className="menu-card">
              <article className="dish">
                {dish.image && (
                  <Link href={`/menu/${dish.slug || dish.id}`} className="dish-image-link">
                    <div className="dish-image">
                      <img src={dish.image} alt={dish.name} loading="lazy" />
                    </div>
                  </Link>
                )}
                <div className="dish-body">
                  <div className="dish-header">
                    <h3 className="dish-name">
                      <Link href={`/menu/${dish.slug || dish.id}`} className="dish-title-link">
                        {dish.name}
                      </Link>{" "}
                      {Boolean(dish.spicy) && <span className="spicy-badge">• Spicy</span>}
                    </h3>
                    <span className="dish-category">{dish.category}</span>
                  </div>
                  <p className="dish-description">{dish.description}</p>
                  <div className="dish-footer">
                    <div className="dish-pricing">
                      <span className="dish-price">{dish.price} ETB</span>
                    </div>
                    <Link
                      href={`/menu/${dish.slug || dish.id}`}
                      className="dish-add-btn"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                    >
                      View Dish →
                    </Link>
                  </div>
                </div>
              </article>
            </Card>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/menu" className="hero-button">
            View All Dishes on Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
