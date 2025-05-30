// src/services/api.ts
import axios, { AxiosError } from 'axios';
import { STORAGE_KEYS } from '../config';

// Update the API_BASE_URL to use API Gateway
const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Allow sending cookies in cross-origin requests
  timeout: 10000 // 10 second timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Always add the token if it exists (for all requests)
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    
    console.log('API Request Interceptor:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      hasUser: !!user,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Add user information for all requests
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.email) {
            config.headers['X-User-Email'] = userData.email;
          }
          if (userData.id) {
            config.headers['X-User-Id'] = userData.id.toString();
          }
          if (userData.roles) {
            config.headers['X-User-Roles'] = Array.isArray(userData.roles) ? userData.roles.join(',') : userData.roles;
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      }
    }
    
    // Log final headers (sanitized)
    const sanitizedHeaders = { ...config.headers };
    if (sanitizedHeaders.Authorization) {
      sanitizedHeaders.Authorization = 'Bearer ***';
    }
    console.log('Final request headers:', sanitizedHeaders);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - clearing auth data');
      
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      // Only redirect if not already on login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        console.log('Redirecting to login page');
        window.location.href = '/login';
      }
    }
    
    // Handle CORS errors
    if (error.message === 'Network Error' && !error.response) {
      console.error('Network error - possibly CORS related');
      error.message = 'Network error: Unable to connect to server. Check CORS configuration.';
    }
    
    return Promise.reject(error);
  }
);

export default api;