import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import axios from "axios";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
//  console.log ("Allowed Roles in ProtectedRoute:", allowedRoles);
  useEffect(() => {
    // You may need to update the URL to your actual endpoint, e.g. "http://localhost:5000/api/auth/me"
    axios.get("http://localhost:2000/api/auth/me", {
      withCredentials: true
    })
    .then(res => {
      setUser(res.data.user);
      setLoading(false);
    })
    .catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

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
