import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, login, logout } from "../api/auth";

const AuthContext = createContext();

// ✅ Hook to access authentication state easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // authenticated user data
  const [loading, setLoading] = useState(true);

  // 🔹 Load user when the app starts (if token exists)
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser(); // fetch user with token
        setUser(res.data || null);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 🔹 Login handler
  const handleLogin = async (email, password) => {
    try {
      setUser(null);
      const res = await login(email, password); // login() stores token internally
      const userResponse = await getCurrentUser(); // fetch user data
      setUser(userResponse.data || null);
      return res;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // 🔹 Logout handler
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  // 🔹 Extract role and ID if present
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
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
