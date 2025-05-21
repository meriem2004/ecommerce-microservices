// src/components/auth/ProtectedRoute.tsx - Simplified version
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { STORAGE_KEYS } from '../../config';

const ProtectedRoute: React.FC = () => {
  // The simplest possible auth check - just look for token in localStorage
  const isAuthenticated = !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  
  // Log for debugging
  console.log('ProtectedRoute - Auth check:', { 
    isAuthenticated, 
    hasToken: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  });

  if (!isAuthenticated) {
    // Only redirect if accessing a protected route
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;