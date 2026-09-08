import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "addis_cafe_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Storage parsing failed
    } finally {
      // Loading completes so RequireAuth doesn't prematurely redirect
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    const loggedUser = {
      name: userData?.name || "Abebe Bikila",
      email: userData?.email || "customer@addiscafe.et",
      loggedInAt: new Date().toISOString(),
    };
    setUser(loggedUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
    } catch {
      // Storage write error ignored
    }
    return loggedUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Storage remove error ignored
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
