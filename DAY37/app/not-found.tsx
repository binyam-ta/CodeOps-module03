import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="empty-state not-found-card">
        <span className="not-found-icon">404</span>
        <h2 className="empty-state-title">Page or Dish Not Found</h2>
        <p className="empty-state-text">
          The page or dish you are looking for does not exist or has been moved. Explore our authentic Ethiopian menu or return to the homepage.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="hero-button">
            Go to Homepage
          </Link>
          <Link href="/menu" className="cta-secondary-link">
            Browse Menu →
          </Link>
        </div>
      </div>
    </div>
  );
}
