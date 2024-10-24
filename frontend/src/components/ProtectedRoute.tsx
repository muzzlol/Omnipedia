import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner.. add lator
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
