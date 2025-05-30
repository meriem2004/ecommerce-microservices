import api from './api';
import { STORAGE_KEYS } from '../config';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItem {
  productId: number;
  quantity: number;
}

interface OrderRequest {
  userId: number;
  shippingAddress: string;
  orderItems: OrderItem[];
}

export const submitOrder = async ({ 
  cart, 
  total, 
  shippingAddress 
}: { 
  cart: CartItem[]; 
  total: number; 
  shippingAddress: string; 
}) => {
  try {
    // Get user data from localStorage
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) {
      throw new Error('User not found. Please log in again.');
    }

    const user = JSON.parse(userStr);
    if (!user.id) {
      throw new Error('User ID not found. Please log in again.');
    }

    // Transform cart items to match backend OrderItemDto structure
    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.productId || item.id, // Handle both productId and id
      quantity: item.quantity
    }));

    // Create order request payload matching backend expectations
    const orderRequest: OrderRequest = {
      userId: user.id,
      shippingAddress,
      orderItems
    };

    console.log('Submitting order with payload:', orderRequest);

    const response = await api.post('/api/orders', orderRequest);
    console.log('Order submitted successfully:', response.data);
    
    return response;
    
  } catch (error: any) {
    console.error('Error submitting order:', error);
    
    // Provide more specific error messages
    if (error.response?.status === 403) {
      throw new Error('Access denied. Please ensure you are logged in with proper permissions.');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error(error.message || 'Failed to submit order. Please try again.');
    }
  }
};