import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  // Check if role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If authorized, render the child routes inside <Outlet />
  return <Outlet />;
};

export default ProtectedRoute;

export default ProtectedRoute;
