// src/services/product.ts
import axios from 'axios';
import api from './api'; // Import your configured api instance
import { Product, Category } from '../types';
import { API_BASE_URL } from '../config';

// Helper function to format error messages
const formatErrorMessage = (error: any): string => {
  if (error.response) {
    // The server responded with a status code outside the 2xx range
    return error.response.data?.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    // The request was made but no response was received
    if (error.message === 'Network Error') {
      return 'Network error: Unable to connect to the API server. This might be due to CORS configuration.';
    }
    return 'No response received from server';
  } else {
    // Something happened in setting up the request
    return error.message || 'Unknown error occurred';
  }
};

// Create a separate axios instance for product requests WITHOUT any auth headers
// This is crucial - we create a fresh instance that never inherits headers from the main axios
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Get all products
 * @returns Promise with array of products
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products from:', `${API_BASE_URL}/api/products`);
    
    // Use the separate publicApi instance that never has auth headers
    const response = await publicApi.get<Product[]>('/api/products');
    console.log(`Fetched ${response.data.length} products successfully`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Try to get more information about the error
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    }
    
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Get a specific product by ID
 * @param id - Product ID
 * @returns Promise with the requested product
 */
export const getProductById = async (id: string): Promise<Product> => {
  try {
    console.log('Fetching product details for ID:', id);
    
    // Use the separate publicApi instance
    const response = await publicApi.get<Product>(`/api/products/${id}`);
    console.log('Product fetched successfully:', response.data.name);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Create a new product (admin only)
 * @param productData - New product data
 * @returns Promise with the created product
 */
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    console.log('Creating product with configured api instance');
    
    // USE THE CONFIGURED API INSTANCE - this is the fix!
    const response = await api.post<Product>('/api/products', productData);
    console.log('Product created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Update an existing product (admin only)
 * @param id - Product ID
 * @param productData - Updated product data
 * @returns Promise with the updated product
 */
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  try {
    console.log('Updating product with configured api instance');
    
    // USE THE CONFIGURED API INSTANCE - this is the fix!
    const response = await api.put<Product>(`/api/products/${id}`, productData);
    console.log('Product updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Delete a product (admin only)
 * @param id - Product ID
 * @returns Promise that resolves when deletion is complete
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    console.log('Deleting product with configured api instance');
    
    // USE THE CONFIGURED API INSTANCE - this is the fix!
    await api.delete(`/api/products/${id}`);
    console.log('Product deleted successfully');
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Get all categories
 * @returns Promise with array of categories
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await publicApi.get<Category[]>('/api/categories');
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};