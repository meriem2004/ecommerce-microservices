// src/hooks/useCart.ts
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addItem, updateItemQuantity, removeItem, clearCart, setCartItems } from '../store/cartSlice';
import { CartItem } from '../types';
import { STORAGE_KEYS } from '../config';

const useCart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // NO backend calls at all - just use localStorage
  useEffect(() => {
    // Load from localStorage only
    console.log('Loading cart from localStorage only');
    const savedItems = getCartItemsFromStorage();
    if (savedItems.length > 0) {
      dispatch(setCartItems(savedItems));
    }
  }, [dispatch]);

  // Function to get cart items from local storage
  const getCartItemsFromStorage = (): CartItem[] => {
    try {
      const cartJson = localStorage.getItem('cart_items');
      const items = cartJson ? JSON.parse(cartJson) : [];
      console.log('Items loaded from localStorage:', items);
      return items;
    } catch (error) {
      console.error('Error getting cart items from localStorage:', error);
      return [];
    }
  };

  // Function to get userId from localStorage
  const getUserIdFromStorage = (): number | null => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || null;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // Function to save cart and cart_items to localStorage
  const saveCartAndItemsToStorage = (items: CartItem[]): void => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(items));
      // Build cart object matching Cart.java
      const userId = getUserIdFromStorage();
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const now = new Date().toISOString();
      const cart = {
        userId,
        items,
        totalAmount,
        createdAt: now,
        updatedAt: now
      };
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Cart and items saved to localStorage:', { cart, items });
    } catch (error) {
      console.error('Error saving cart and items to localStorage:', error);
    }
  };

  const fetchCartItems = () => {
    // NO API calls - just load from localStorage
    console.log('Refreshing cart from localStorage');
    const savedItems = getCartItemsFromStorage();
    dispatch(setCartItems(savedItems));
  };

  const addToCart = (item: CartItem) => {
    try {
      console.log('Adding item to cart (localStorage only):', item);
      const currentItems = getCartItemsFromStorage();
      const existingItemIndex = currentItems.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );
      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
      } else {
        updatedItems = [...currentItems, item];
      }
      saveCartAndItemsToStorage(updatedItems);
      dispatch(setCartItems(updatedItems));
    } catch (err: any) {
      console.error('Failed to add item to cart:', err);
      setError('Failed to add item to cart');
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    try {
      console.log(`Updating quantity for product ${productId} to ${quantity}`);
      const currentItems = getCartItemsFromStorage();
      const updatedItems = currentItems.map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      saveCartAndItemsToStorage(updatedItems);
      dispatch(setCartItems(updatedItems));
    } catch (err: any) {
      console.error('Failed to update item quantity:', err);
      setError('Failed to update item quantity');
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      console.log(`Removing product ${productId} from cart`);
      const currentItems = getCartItemsFromStorage();
      const updatedItems = currentItems.filter((item) => item.productId !== productId);
      saveCartAndItemsToStorage(updatedItems);
      dispatch(setCartItems(updatedItems));
    } catch (err: any) {
      console.error('Failed to remove item from cart:', err);
      setError('Failed to remove item from cart');
    }
  };

  const emptyCart = () => {
    try {
      console.log('Clearing cart');
      localStorage.removeItem('cart_items');
      localStorage.removeItem('cart');
      dispatch(clearCart());
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
    }
  };

  // Function to clear the error state
  const clearErrorState = () => {
    setError(null);
  };

  const getCartTotal = () => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get the total number of items in the cart
  const getItemCount = () => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    items: items || [], // Ensure items is always an array
    loading: false, // Never loading since we're not making API calls
    error: null, // No API errors
    addToCart,
    updateQuantity,
    removeFromCart,
    emptyCart,
    getCartTotal,
    getItemCount,
    refreshCart: fetchCartItems,
    clearError: clearErrorState
  };
};

export default useCart;