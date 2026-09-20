import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";
import Layout from "./Layout";
import Home from "./Home";
import Menu from "./Menu";
import Login from "./Login";
import NotFound from "./NotFound";
import RequireAuth from "./RequireAuth";
import ErrorBoundary from "./ErrorBoundary";
import { CheckoutSkeleton, PageSkeleton } from "./ui/Skeleton";

// Lazy-loaded routes: code-split so non-checkout visitors never download checkout chunks
const Checkout = lazy(() => import("./Checkout"));
const Cart = lazy(() => import("./Cart"));
const DishDetail = lazy(() => import("./DishDetail"));

/* ===================================================
   Custom Informative Fallbacks for Independent Boundaries
   =================================================== */
function MenuFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-boundary-fallback menu-fallback-container" role="alert">
      <div className="error-boundary-card">
        <span className="error-boundary-icon" aria-hidden="true">🍲⚠️</span>
        <h2 className="error-boundary-title">Menu is Temporarily Unavailable</h2>
        <p className="error-boundary-message">
          We encountered an issue displaying our dishes. The rest of Addis Café (including your cart and navigation) remains active.
        </p>
        {error?.message && (
          <p className="error-boundary-detail">
            <code>{error.message}</code>
          </p>
        )}
        <div className="error-boundary-actions">
          <button type="button" className="hero-button" onClick={resetErrorBoundary}>
            Try Reloading Menu
          </button>
          <Link to="/cart" className="cta-secondary-link">
            View Your Cart →
          </Link>
        </div>
      </div>
    </div>
  );
}

MenuFallback.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func.isRequired,
};

function CartFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-boundary-fallback cart-fallback-container" role="alert">
      <div className="error-boundary-card">
        <span className="error-boundary-icon" aria-hidden="true">🛒⚠️</span>
        <h2 className="error-boundary-title">Your Cart is Temporarily Unavailable</h2>
        <p className="error-boundary-message">
          We had trouble displaying your cart. Don&apos;t worry — your items are safely stored.
        </p>
        {error?.message && (
          <p className="error-boundary-detail">
            <code>{error.message}</code>
          </p>
        )}
        <div className="error-boundary-actions">
          <button type="button" className="hero-button" onClick={resetErrorBoundary}>
            Try Reloading Cart
          </button>
          <Link to="/menu" className="cta-secondary-link">
            Browse Menu →
          </Link>
        </div>
      </div>
    </div>
  );
}

CartFallback.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func.isRequired,
};

function CheckoutFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-boundary-fallback checkout-fallback-container" role="alert">
      <div className="error-boundary-card">
        <span className="error-boundary-icon" aria-hidden="true">💳⚠️</span>
        <h2 className="error-boundary-title">Checkout Could Not Be Loaded</h2>
        <p className="error-boundary-message">
          Unable to download the checkout module. Please verify your internet connection and try again.
        </p>
        {error?.message && (
          <p className="error-boundary-detail">
            <code>{error.message}</code>
          </p>
        )}
        <div className="error-boundary-actions">
          <button type="button" className="hero-button" onClick={resetErrorBoundary}>
            Retry Loading Checkout
          </button>
          <Link to="/cart" className="cta-secondary-link">
            Return to Cart →
          </Link>
        </div>
      </div>
    </div>
  );
}

CheckoutFallback.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func.isRequired,
};

/**
 * Main application component.
 * Configures separate ErrorBoundaries around Menu, Cart, and Checkout,
 * ensuring failure in one region does not bring down the other regions.
 * Lazy-loads Checkout and Cart behind realistic Suspense skeletons.
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />

              {/* Menu route wrapped in dedicated ErrorBoundary */}
              <Route
                path="menu"
                element={
                  <ErrorBoundary name="Menu" fallback={MenuFallback}>
                    <Menu />
                  </ErrorBoundary>
                }
              />

              {/* Dynamic DishDetail lazy loaded with skeleton and boundary */}
              <Route
                path="menu/:id"
                element={
                  <ErrorBoundary name="Dish Details">
                    <Suspense fallback={<PageSkeleton />}>
                      <DishDetail />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Cart route wrapped in dedicated ErrorBoundary & lazy loaded */}
              <Route
                path="cart"
                element={
                  <ErrorBoundary name="Cart" fallback={CartFallback}>
                    <Suspense fallback={<PageSkeleton />}>
                      <Cart />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Checkout route lazy-loaded behind Suspense skeleton with dedicated ErrorBoundary */}
              <Route
                path="checkout"
                element={
                  <ErrorBoundary name="Checkout" fallback={CheckoutFallback}>
                    <Suspense fallback={<CheckoutSkeleton />}>
                      <RequireAuth>
                        <Checkout />
                      </RequireAuth>
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              <Route path="login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
