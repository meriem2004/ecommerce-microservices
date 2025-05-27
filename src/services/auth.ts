// src/services/auth.ts
import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';
import { STORAGE_KEYS } from '../config';

const API_BASE_URL = 'http://localhost:8080';
const DEBUG = true;

// Set auth token in headers and localStorage
export const setAuthToken = (token: string | null) => {
  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    api.defaults.headers.common['Authorization'] = formattedToken;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    DEBUG && console.log('Auth token set');
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    DEBUG && console.log('Auth token removed');
  }
};

// Set user data in localStorage
export const setUserData = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

// Check authentication status
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) && !!getCurrentUser();
};

// Verify token with backend
export const verifyToken = async (): Promise<boolean> => {
  try {
    const response = await api.get('/api/auth/verify');
    return response.status === 200;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

// Register new user
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/api/auth/register', userData);
    const { token, refreshToken, user } = response.data;
    
    setAuthToken(token);
    setUserData(user);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Login user
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      email: credentials.username,
      password: credentials.password
    });
    
    const { token, refreshToken, user } = response.data;
    setAuthToken(token);
    setUserData(user);
    
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Refresh token
export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) return null;

  try {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    const newToken = response.data.token;
    setAuthToken(newToken);
    
    if (response.data.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
    }
    
    return newToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    return null;
  }
};

// Logout user
export const logout = (): void => {
  setAuthToken(null);
  setUserData(null);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CART);
};

// Initialize auth state on app start
export const initializeAuth = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    setAuthToken(token);
  }
};