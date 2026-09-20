import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Guarded hook for accessing the AuthContext session.
 * Throws an actionable error if called outside an AuthProvider.
 *
 * @returns {{ user: Object|null, loading: boolean, login: Function, logout: Function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useAuth;
