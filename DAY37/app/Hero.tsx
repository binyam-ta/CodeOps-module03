import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay">
        <div className="hero-content">
          <h2 className="hero-heading">Addis Café</h2>
          <p className="hero-subtext">
            Fresh Ethiopian Food &amp; Coffee in the Heart of Addis Ababa
          </p>
          <Link href="/menu" className="hero-button">
            View Our Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
