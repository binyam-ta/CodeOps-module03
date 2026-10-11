import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay">
        <div className="hero-content">
          <h2 className="hero-heading">Addis Eats</h2>
          <p className="hero-subtext">
            Fresh Ethiopian Food &amp; Coffee in the Heart of Addis Ababa
          </p>
          <div className="hero-cta-group" style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
            <Link href="/menu" className="hero-button">
              View Our Menu
            </Link>
            <Link href="/checkout" className="cta-secondary-link" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "var(--radius)" }}>
              Order via TeleBirr
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
