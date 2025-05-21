// src/config.ts
// Central configuration file for the application

// API endpoints
export const API_BASE_URL = 'http://localhost:8080'; // API Gateway port

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  CART: 'cart_data'
};

// Feature flags
export const FEATURES = {
  DEBUG_MODE: process.env.NODE_ENV !== 'production',
  ENABLE_DIAGNOSTICS: process.env.NODE_ENV !== 'production'
};

// Timeout settings
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  TOKEN_REFRESH: 5000  // 5 seconds
};