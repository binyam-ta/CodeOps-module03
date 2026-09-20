import { Component } from "react";
import PropTypes from "prop-types";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  
    console.error(`[ErrorBoundary${this.props.name ? ` (${this.props.name})` : ""}] Caught error:`, error, errorInfo);
  }

  resetErrorBoundary() {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      // 1. Custom render function fallback: ({ error, resetErrorBoundary }) => ...
      if (typeof this.props.fallback === "function") {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      // 2. Custom element fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 3. Default informative fallback UI
      const sectionName = this.props.name || "This section";
      return (
        <div className="error-boundary-fallback" role="alert">
          <div className="error-boundary-card">
            <h3 className="error-boundary-title">{sectionName} is temporarily unavailable</h3>
            <p className="error-boundary-message">
              We hit an unexpected snag while loading this part of the page. Don&apos;t worry — the rest of Addis Café (including navigation and your cart) is working normally.
            </p>
            {this.state.error?.message && (
              <p className="error-boundary-detail">
                <code>{this.state.error.message}</code>
              </p>
            )}
            <div className="error-boundary-actions">
              <button
                type="button"
                className="hero-button error-retry-btn"
                onClick={this.resetErrorBoundary}
              >
                Try Again
              </button>
              <a href="/" className="error-secondary-link">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  name: PropTypes.string,
  onReset: PropTypes.func,
  onError: PropTypes.func,
};

export default ErrorBoundary;
