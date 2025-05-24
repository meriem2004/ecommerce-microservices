// src/components/auth/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store'; // <-- import your AppDispatch type
import { verifyAuthToken, updateAuthState } from '../../store/authSlice';
import * as authService from '../../services/auth';
import { STORAGE_KEYS } from '../../config';

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch: AppDispatch = useDispatch(); // <-- type your dispatch

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (!token) {
          setIsVerified(false);
          setLoading(false);
          return;
        }

        // First try to verify the token
        const result = await dispatch(verifyAuthToken());
        if (verifyAuthToken.fulfilled.match(result)) {
          setIsVerified(true);
          setLoading(false);
          return;
        }

        // If verification fails, try to refresh the token
        const newToken = await authService.refreshToken();
        if (newToken) {
          dispatch(updateAuthState());
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [location.pathname, dispatch]);

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