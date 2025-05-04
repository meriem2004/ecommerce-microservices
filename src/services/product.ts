import api from './api';
import { Product } from '../types';

export const getProducts = async (params?: Record<string, string>): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products', { params });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products/search', { 
    params: { q: searchTerm } 
  });
  return response.data;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await api.get<Product[]>(`/products/category/${category}`);
  return response.data;
};