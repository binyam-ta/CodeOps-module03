import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

/**
 * Route guard component protecting private screens (like /checkout).
 * Uses guarded useAuth hook, waits for auth loading before redirecting,
 * and remembers the attempted destination in location.state.from.
 */
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for loading to finish so refreshing while signed in doesn't prematurely redirect to login
  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="spinner" />
        <p className="auth-loading-text">Checking authorization...</p>
      </div>
    );
  }

  // Redirect to /login if not signed in, saving target in location.state.from
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
