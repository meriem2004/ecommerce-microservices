import api from './api';
import { Order, Address, PaymentMethod } from '../types';

// Create a new order
export const createOrder = async (
  items: any[], 
  shippingAddress: Address, 
  paymentMethod: PaymentMethod
): Promise<Order> => {
  const response = await api.post<Order>('/orders', {
    items,
    shippingAddress,
    paymentMethod
  });
  return response.data;
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data;
};

// Get all orders for current user
export const getUserOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/orders/me');
  return response.data;
};