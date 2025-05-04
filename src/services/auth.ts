import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';
import { STORAGE_KEYS } from '../config';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  
  // Store token and user data
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
  
  return response.data;
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  
  // Store token and user data
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
  
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  return userJson ? JSON.parse(userJson) : null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};