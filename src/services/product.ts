// src/services/product.ts
import axios from 'axios';
import { Product } from '../types';

const API_BASE_URL = 'http://localhost:8081'; // Your API gateway URL

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

/**
 * Get all products
 * @returns Promise with array of products
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_BASE_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
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
    const response = await axios.get<Product>(`${API_BASE_URL}/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Search for products by name or description
 * @param searchTerm - Search query
 * @returns Promise with array of matching products
 */
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `${API_BASE_URL}/api/products/search?term=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error searching products with term ${searchTerm}:`, error);
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Get all products in a specific category
 * @param categoryId - Category ID
 * @returns Promise with array of products in the category
 */
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `${API_BASE_URL}/api/products/category/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
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
    const response = await axios.post<Product>(
      `${API_BASE_URL}/api/products`,
      productData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }
    );
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
    const response = await axios.put<Product>(
      `${API_BASE_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }
    );
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
    await axios.delete(
      `${API_BASE_URL}/api/products/${id}/delete`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }
    );
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Update product stock (admin only)
 * @param id - Product ID
 * @param quantity - New stock quantity
 * @returns Promise with the updated product
 */
export const updateProductStock = async (id: string, quantity: number): Promise<Product> => {
  try {
    const response = await axios.put<Product>(
      `${API_BASE_URL}/api/products/${id}/stock`,
      { quantity },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating stock for product ${id}:`, error);
    throw new Error(formatErrorMessage(error));
  }
};