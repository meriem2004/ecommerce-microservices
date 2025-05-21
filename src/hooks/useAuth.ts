// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  loginUser, 
  registerUser, 
  logoutUser,
  clearError 
} from '../store/authSlice';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { AppDispatch, RootState } from '../store';

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [localError, setLocalError] = useState<string | null>(null);

  // Additional debugging useEffect
  useEffect(() => {
    console.log('useAuth hook - Auth state updated:', {
      isAuthenticated: auth.isAuthenticated,
      hasToken: !!auth.token,
      hasUser: !!auth.user,
      localStorage: {
        token: !!localStorage.getItem('auth_token'),
        user: !!localStorage.getItem('user')
      }
    });
  }, [auth.isAuthenticated, auth.token, auth.user]);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      // Clear any previous errors
      dispatch(clearError());
      setLocalError(null);
      
      console.log('Attempting login with:', credentials.username);
      const resultAction = await dispatch(loginUser(credentials));
      
      if (loginUser.fulfilled.match(resultAction)) {
        console.log('Login successful, user is now authenticated');
        
        // Debug: Check what's in localStorage after login
        console.log('Auth token in localStorage:', Boolean(localStorage.getItem('auth_token')));
        console.log('User in localStorage:', Boolean(localStorage.getItem('user')));
        
        // Add a small delay to ensure state updates are propagated
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return resultAction.payload;
      } else {
        // Handle rejected action
        const errorMessage = resultAction.payload as string || 'Login failed';
        setLocalError(errorMessage);
        console.error('Login failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Login hook error:', error);
      const errorMessage = error.message || 'Login failed';
      setLocalError(errorMessage);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      // Clear any previous errors
      dispatch(clearError());
      setLocalError(null);
      
      console.log('Attempting registration with:', userData.email);
      const resultAction = await dispatch(registerUser(userData));
      
      if (registerUser.fulfilled.match(resultAction)) {
        console.log('Registration successful, user is now authenticated');
        
        // Debug: Check what's in localStorage
        console.log('Auth token in localStorage:', Boolean(localStorage.getItem('auth_token')));
        console.log('User in localStorage:', Boolean(localStorage.getItem('user')));
        
        // Add a small delay to ensure state updates are propagated
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return resultAction.payload;
      } else {
        // Handle rejected action
        const errorMessage = resultAction.payload as string || 'Registration failed';
        setLocalError(errorMessage);
        console.error('Registration failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Registration hook error:', error);
      const errorMessage = error.message || 'Registration failed';
      setLocalError(errorMessage);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await dispatch(logoutUser());
      console.log('Logout successful, auth state cleared');
      
      // Verify localStorage is cleared
      console.log('Auth token after logout:', Boolean(localStorage.getItem('auth_token')));
      console.log('User after logout:', Boolean(localStorage.getItem('user')));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    login,
    register,
    logout,
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: localError || auth.error,
  };
};

export default useAuth;