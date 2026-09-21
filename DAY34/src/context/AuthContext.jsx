import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "addis_cafe_auth_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Storage error ignored
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    const loggedUser = {
      name: userData?.name || "Abebe Bikila",
      email: userData?.email || "abebe@addiscafe.et",
    };
    setUser(loggedUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
    } catch {
      // Storage error ignored
    }
    return loggedUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Storage error ignored
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
