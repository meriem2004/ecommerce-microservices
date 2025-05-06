// src/services/auth.ts
import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

const API_BASE_URL = 'http://localhost:8086'; // Updated to match your backend port
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// Enable verbose logging for debugging
const DEBUG = true;

// Set auth token for every request
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (DEBUG) console.log('Auth token set in headers and localStorage');
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem(AUTH_TOKEN_KEY);
    if (DEBUG) console.log('Auth token removed from headers and localStorage');
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(USER_KEY);
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      if (DEBUG) console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
};

// Register new user
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  if (DEBUG) console.log('Registering user with data:', JSON.stringify(userData));
  
  try {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/api/auth/register`, userData);
    if (DEBUG) console.log('Registration successful, response:', response.data);
    
    const { token, refreshToken, user } = response.data;
    
    // Store token and user data
    setAuthToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Also store refresh token if available
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      if (DEBUG) console.log('Refresh token stored in localStorage');
    }
    
    return response.data;
  } catch (error: any) {
    if (DEBUG) {
      console.error('Registration failed:', error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : error.message);
    }
    throw error;
  }
};

// Login user
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  if (DEBUG) console.log('Logging in user with credentials:', { email: credentials.username });
  
  try {
    // Ensure we're using the email field as expected by the backend
    const loginData = {
      email: credentials.username, // Map the username field to email for backend
      password: credentials.password
    };
    
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/api/auth/login`, loginData);
    if (DEBUG) console.log('Login successful, response:', response.data);
    
    const { token, refreshToken, user } = response.data;
    
    // Store token and user data
    setAuthToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Also store refresh token if available
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      if (DEBUG) console.log('Refresh token stored in localStorage');
    }
    
    return response.data;
  } catch (error: any) {
    if (DEBUG) {
      console.error('Login failed:', error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : error.message);
    }
    throw error;
  }
};

// Refresh token
export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (!refreshToken) {
    if (DEBUG) console.log('No refresh token found in localStorage');
    return null;
  }
  
  try {
    if (DEBUG) console.log('Attempting to refresh token');
    
    // IMPORTANT: Don't set Authorization header for refresh token request
    // Create a new axios instance without default headers for this specific request
    const axiosInstance = axios.create();
    delete axiosInstance.defaults.headers.common['Authorization'];
    
    const response = await axiosInstance.post<{ token: string, refreshToken: string }>(`${API_BASE_URL}/api/auth/refresh`, 
      { refreshToken } // Send as object with refreshToken property
    );
    
    if (DEBUG) console.log('Token refresh successful, new token received');
    
    const newToken = response.data.token;
    setAuthToken(newToken);
    
    // Update refresh token if a new one is provided
    if (response.data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
      if (DEBUG) console.log('New refresh token stored in localStorage');
    }
    
    return newToken;
  } catch (error: any) {
    if (DEBUG) {
      console.error('Token refresh failed:', error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : error.message);
    }
    // If refresh fails, logout
    logout();
    return null;
  }
};

// Logout user
export const logout = (): void => {
  if (DEBUG) console.log('Logging out user');
  setAuthToken(null);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Setup interceptor to handle token refresh
export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If the error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (DEBUG) console.log('401 Unauthorized error detected, attempting token refresh');
        originalRequest._retry = true;
        
        const newToken = await refreshToken();
        if (newToken) {
          if (DEBUG) console.log('Token refreshed successfully, retrying original request');
          // Retry the original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      }
      
      return Promise.reject(error);
    }
  );

  // Add request interceptor for debugging
  if (DEBUG) {
    axios.interceptors.request.use(
      (config) => {
        console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data
        });
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );
  }
};

// Load token on app start
export const loadToken = (): void => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    if (DEBUG) console.log('Found existing token in localStorage, setting in headers');
    setAuthToken(token);
  }
  setupAxiosInterceptors();
};