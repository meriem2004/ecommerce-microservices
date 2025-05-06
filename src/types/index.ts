// src/types/index.ts
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
  username: string; // Will be mapped to email in the auth service
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