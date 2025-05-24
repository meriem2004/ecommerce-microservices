// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  loginUser, 
  registerUser, 
  logoutUser,
  clearError,
  updateAuthState,
  verifyAuthToken,
  refreshAuthToken
} from '../store/authSlice';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { AppDispatch, RootState } from '../store';
import { STORAGE_KEYS } from '../config';
import * as authService from '../services/auth';

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) return;

      try {
        // First try to verify the existing token
        const isValid = await authService.verifyToken();
        if (isValid) {
          dispatch(updateAuthState());
          return;
        }

        // If verification fails, try to refresh the token
        const newToken = await authService.refreshToken();
        if (newToken) {
          dispatch(updateAuthState());
        } else {
          dispatch(logoutUser());
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch(logoutUser());
      }
    };

    initializeAuth();
  }, [dispatch]);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      dispatch(clearError());
      setLocalError(null);
      
      const resultAction = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(resultAction)) {
        await dispatch(verifyAuthToken());
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload as string || 'Login failed');
      }
    } catch (error: any) {
      setLocalError(error.message);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      dispatch(clearError());
      setLocalError(null);
      
      const resultAction = await dispatch(registerUser(userData));
      if (registerUser.fulfilled.match(resultAction)) {
        await dispatch(verifyAuthToken());
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload as string || 'Registration failed');
      }
    } catch (error: any) {
      setLocalError(error.message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await dispatch(logoutUser());
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const verifyAuth = async (): Promise<boolean> => {
    try {
      const result = await dispatch(verifyAuthToken());
      return verifyAuthToken.fulfilled.match(result);
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  };

  return {
    login,
    register,
    logout,
    verifyAuth,
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: localError || auth.error,
  };
};

export default useAuth;