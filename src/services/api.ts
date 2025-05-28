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
  withCredentials: true // Allow sending cookies in cross-origin requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Always add the token if it exists (for all requests)
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Add user information for cart service requests
      if (config.url && config.url.includes('/api/carts')) {
        const userJson = localStorage.getItem(STORAGE_KEYS.USER);
        if (userJson) {
          try {
            const user = JSON.parse(userJson);
            if (user.email) {
              config.headers['X-User-Email'] = user.email;
            }
            if (user.id) {
              config.headers['X-User-Id'] = user.id.toString();
            }
          } catch (err) {
            console.error('Error parsing user data:', err);
          }
        }
      }
      
      // Log request info for debugging
      console.log('Request config:', {
        url: config.url,
        method: config.method,
        headers: config.headers
      });
    } else {
      console.log('No auth token available for request');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Handle 401 Unauthorized errors (expired token, etc.)
    if (error.response?.status === 401) {
      console.log('401 Unauthorized response from API');
      
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      // Redirect to login page if not already there
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;