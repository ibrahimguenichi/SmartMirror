import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRedirect = () => {
  const { user, loading, userRole } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // Redirect based on user role
  switch (userRole) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'USER':
      return <Navigate to="/" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default RoleBasedRedirect;


