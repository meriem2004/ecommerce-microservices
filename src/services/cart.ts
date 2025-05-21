// src/services/cart.ts
import { CartItem } from '../types';

export const STORAGE_KEYS = {
  CART: 'cart_items'
};

// Get cart items from local storage
export const getCartItems = (): CartItem[] => {
  try {
    const cartJson = localStorage.getItem(STORAGE_KEYS.CART);
    return cartJson ? JSON.parse(cartJson) : [];
  } catch (error) {
    console.error('Error getting cart items from localStorage:', error);
    return [];
  }
};

// Save cart items to local storage
export const saveCartItems = (items: CartItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart items to localStorage:', error);
  }
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
  productId: string | number, 
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
export const removeFromCart = (productId: string | number): CartItem[] => {
  const cartItems = getCartItems();
  const updatedItems = cartItems.filter((item) => item.productId !== productId);
  saveCartItems(updatedItems);
  return updatedItems;
};

// Clear cart
export const clearCart = (): CartItem[] => {
  localStorage.removeItem(STORAGE_KEYS.CART);
  return [];
};