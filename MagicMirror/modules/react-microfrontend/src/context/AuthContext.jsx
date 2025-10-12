import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, login, logout } from "../api/auth";

const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // full user object
  const [loading, setLoading] = useState(true);

  // Initialize auth on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get current user - this will work if JWT cookie exists
        const res = await getCurrentUser();    // fetch full user from backend
        setUser(res.data || null);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
        // Clear any invalid JWT cookie
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const handleLogin = async (email, password) => {
    try {
      // Clear any existing user state first
      setUser(null);
      await login(email, password);            // sets HttpOnly cookie in backend
      
      // Small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const res = await getCurrentUser();      // fetch full user after login
      setUser(res.data || null);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();                           // clears cookie in backend
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear user state immediately
      setUser(null);
      // Clear JWT cookie on frontend as well
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  };

  // Optional: decode role or userId if needed
  const userId = user?.id || null;
  const userRole = user?.userRole || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        userId,
        userRole,
        isAdmin: userRole === "ADMIN",
        isUser: userRole === "USER",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
