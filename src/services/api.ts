// src/services/api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { STORAGE_KEYS } from '../config';

const API_BASE_URL = 'http://localhost:8080';

// Initialize axios with the token if it exists in localStorage
const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
if (token) {
  console.log('Initializing axios with token from localStorage');
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  },
  withCredentials: true
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers = config.headers || {};
      // Ensure token has Bearer prefix
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = authHeader;
      
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url} with Auth token`);
    } else {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url} without Auth token`);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} for ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    console.error('API Error:', {
      status: error.response?.status,
      method: error.config?.method,
      url: error.config?.url,
      data: error.response?.data
    });
    
    const originalRequest = error.config as any;
    
    // Handle token expiration (401) and avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('Attempting to refresh token...');
        // Attempt to refresh token
        const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
          withCredentials: true
        });
        
        console.log('Token refresh response:', refreshResponse.data);
        
        if (refreshResponse.data.token) {
          // Store new token and retry original request
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, refreshResponse.data.token);
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, clear auth state and redirect to login
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default api;