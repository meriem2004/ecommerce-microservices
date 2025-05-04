// Application configuration
export const API_BASE_URL = 'http://localhost:8080/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation/:id',
  ORDER_HISTORY: '/orders',
  PROFILE: '/profile',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  CART: 'cart_items',
};