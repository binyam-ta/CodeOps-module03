import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="empty-state not-found-card">
        <span className="not-found-icon">404</span>
        <h2 className="empty-state-title">Page Not Found</h2>
        <p className="empty-state-text">
          The page you are looking for does not exist or has been moved. Explore our authentic Ethiopian menu or return home.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="hero-button">
            Go to Homepage
          </Link>
          <Link to="/menu" className="cta-secondary-link">
            Browse Menu →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
