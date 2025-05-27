// src/components/auth/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, verifyAuth, loading } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        setIsVerified(true);
      } else {
        const verified = await verifyAuth();
        setIsVerified(verified);
      }
    };

    checkAuth();
  }, [location.pathname, isAuthenticated, verifyAuth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isVerified ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;