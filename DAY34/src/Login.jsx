import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "./useAuth";

function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Remember attempted destination
  const from = location.state?.from?.pathname || location.state?.from || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const customerName = name.trim() || "Abebe Bikila";
    const customerEmail = email.trim() || "abebe@addiscafe.et";
    login({ name: customerName, email: customerEmail });
    navigate(from, { replace: true });
  };

  const handleQuickLogin = () => {
    login({ name: "Abebe Bikila", email: "abebe@addiscafe.et" });
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Sign In to Addis Café</h2>
          <p className="login-subtitle">
            {from.includes("checkout")
              ? "Sign in to complete your TeleBirr delivery order."
              : "Access your account and saved order history."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="e.g. Abebe Bikila"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="e.g. abebe@addiscafe.et"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <button type="submit" className="hero-button login-submit-btn">
            Sign In &amp; Continue
          </button>
        </form>

        <div className="login-divider">
          <span>Instant Testing</span>
        </div>

        <button
          type="button"
          className="demo-login-btn"
          onClick={handleQuickLogin}
          aria-label="One-click demo sign in"
        >
           1-Click Demo Sign In (Abebe Bikila)
        </button>

        <p className="login-back-note">
          <Link to="/">← Return to Homepage</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
