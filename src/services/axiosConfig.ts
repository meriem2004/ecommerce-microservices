// src/services/axiosConfig.ts
import axios from 'axios';
import authService from './auth';
import { API_BASE_URL } from '../config';

// Create default axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    // Check if authenticated routes
    if (config.url?.includes('/api/products/') && 
        (config.url.includes('/stock') || config.url.includes('/delete'))) {
      // Check authentication
      const isAuth = await authService.isAuthenticated();
      if (!isAuth) {
        // Handle auth failure - redirect to login
        window.location.href = '/login';
        return Promise.reject('Authentication required');
      }
      
      // Add token to request
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshed = await authService.refreshToken();
        
        if (refreshed) {
          // Update token in header
          const token = authService.getToken();
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
      }
      
      // Redirect to login if refresh failed
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;