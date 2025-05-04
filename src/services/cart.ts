import api from './api';
import { CartItem } from '../types';
import { STORAGE_KEYS } from '../config';

// Get cart items from local storage
export const getCartItems = (): CartItem[] => {
  const cartJson = localStorage.getItem(STORAGE_KEYS.CART);
  return cartJson ? JSON.parse(cartJson) : [];
};

// Save cart items to local storage
export const saveCartItems = (items: CartItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
};

// Add item to cart
export const addToCart = (item: CartItem): CartItem[] => {
  const cartItems = getCartItems();
  
  // Check if item already exists in cart
  const existingItemIndex = cartItems.findIndex(
    (cartItem) => cartItem.productId === item.productId
  );
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    const updatedItems = [...cartItems];
    updatedItems[existingItemIndex].quantity += item.quantity;
    saveCartItems(updatedItems);
    return updatedItems;
  } else {
    // Add new item if it doesn't exist
    const updatedItems = [...cartItems, item];
    saveCartItems(updatedItems);
    return updatedItems;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = (
  productId: string, 
  quantity: number
): CartItem[] => {
  const cartItems = getCartItems();
  
  const updatedItems = cartItems.map((item) => {
    if (item.productId === productId) {
      return { ...item, quantity };
    }
    return item;
  });
  
  saveCartItems(updatedItems);
  return updatedItems;
};

// Remove item from cart
export const removeFromCart = (productId: string): CartItem[] => {
  const cartItems = getCartItems();
  const updatedItems = cartItems.filter((item) => item.productId !== productId);
  saveCartItems(updatedItems);
  return updatedItems;
};

// Clear cart
export const clearCart = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CART);
};