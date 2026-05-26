import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../app/store/auth.store';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Save current location they were trying to go to
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Render child routes
  return <Outlet />;
};
