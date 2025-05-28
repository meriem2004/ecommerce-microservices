// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  loginUser, 
  registerUser, 
  logoutUser,
  clearError,
  updateAuthState,
  syncAuthFromStorage
} from '../store/authSlice';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { AppDispatch, RootState } from '../store';
import { STORAGE_KEYS } from '../config';

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [localError, setLocalError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        
        console.log('Initializing auth:', { 
          hasToken: !!token, 
          hasUser: !!userData,
          token: token?.substring(0, 20) + '...',
          user: userData ? JSON.parse(userData) : null
        });

        if (token && userData) {
          // Sync auth state from localStorage
          dispatch(syncAuthFromStorage());
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Verify authentication status
  const verifyAuth = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      
      const isValid = !!(token && userData);
      console.log('Auth verification:', { isValid, hasToken: !!token, hasUser: !!userData });
      
      if (isValid) {
        dispatch(syncAuthFromStorage());
      }
      
      return isValid;
    } catch (error) {
      console.error('Auth verification error:', error);
      return false;
    }
  }, [dispatch]);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      dispatch(clearError());
      setLocalError(null);
      
      const resultAction = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(resultAction)) {
        console.log('Login successful:', resultAction.payload);
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload as string || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
        console.log('Registration successful:', resultAction.payload);
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload as string || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setLocalError(error.message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('Logging out user...');
      await dispatch(logoutUser());
      
      // Clear all localStorage data
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CART);
      
      console.log('Logout completed');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Get user data from localStorage for cart service
  const getUserData = useCallback(() => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }, []);

  // Get auth token for API calls
  const getAuthToken = useCallback(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }, []);

  console.log('useAuth state:', {
    user: auth.user,
    token: auth.token?.substring(0, 20) + '...',
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: localError || auth.error,
    localStorageUser: getUserData(),
    localStorageToken: !!getAuthToken()
  });

  return {
    login,
    register,
    logout,
    verifyAuth,
    getUserData,
    getAuthToken,
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: localError || auth.error,
  };
};

export default useAuth;