// src/components/auth/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../../config';

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        
        const authenticated = !!(token && userData);
        
        console.log('ProtectedRoute auth check:', {
          hasToken: !!token,
          hasUser: !!userData,
          authenticated,
          location: location.pathname
        });
        
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content
  return <Outlet />;
};

export default ProtectedRoute;