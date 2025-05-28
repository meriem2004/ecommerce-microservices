// Update to src/types/index.ts - adding cart related types

// User related interfaces
export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  address?: string | null;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

// Response from backend when registering
export interface RegisterResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth response for login/refresh
export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn?: number;
}

// Category interface
export interface Category {
  id: number | string;
  name: string;
  description?: string;
}

// Product related interfaces
export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  inStock?: boolean;
  imageUrl?: string;
  category?: Category;
}

// Cart related interfaces
export interface CartItem {
  id?: number | string;  // Backend ID for the cart item
  productId: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartResponse {
  id: number | string;
  userId: number | string;
  items: CartItem[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddItemRequest {
  productId: string | number;
  quantity: number;
}

export interface UpdateItemRequest {
  quantity: number;
}

export interface CheckoutRequest {
  paymentMethod: string;
  shippingAddress: string;
  // Add other checkout fields as needed
}