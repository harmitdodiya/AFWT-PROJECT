import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// "Route Protection": client-side routing guard that evaluates the local
// auth state before permitting an interface to mount (SRS section 1.3 / 5).
export default function ProtectedRoute({ role, children }) {
  const { auth } = useAuth();

  if (!auth || !auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && auth.user.role !== role) {
    const fallback = auth.user.role === "Admin" ? "/admin" : "/customer";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
