import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
}