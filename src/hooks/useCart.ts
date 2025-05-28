// src/hooks/useCart.ts
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addItem, updateItemQuantity, removeItem, clearCart, setCartItems } from '../store/cartSlice';
import { CartItem } from '../types';

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

  // Function to save cart items to local storage
  const saveCartItemsToStorage = (items: CartItem[]): void => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(items));
      console.log('Items saved to localStorage:', items);
    } catch (error) {
      console.error('Error saving cart items to localStorage:', error);
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
      
      // Get current items from localStorage
      const currentItems = getCartItemsFromStorage();
      
      // Check if item already exists
      const existingItemIndex = currentItems.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item if it doesn't exist
        updatedItems = [...currentItems, item];
      }
      
      // Save to localStorage
      saveCartItemsToStorage(updatedItems);
      
      // Update Redux store
      dispatch(setCartItems(updatedItems));
      
    } catch (err: any) {
      console.error('Failed to add item to cart:', err);
      setError('Failed to add item to cart');
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    try {
      console.log(`Updating quantity for product ${productId} to ${quantity}`);
      
      // Get current items from localStorage
      const currentItems = getCartItemsFromStorage();
      
      // Update the specific item
      const updatedItems = currentItems.map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      // Save to localStorage
      saveCartItemsToStorage(updatedItems);
      
      // Update Redux store
      dispatch(setCartItems(updatedItems));
      
    } catch (err: any) {
      console.error('Failed to update item quantity:', err);
      setError('Failed to update item quantity');
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      console.log(`Removing product ${productId} from cart`);
      
      // Get current items from localStorage
      const currentItems = getCartItemsFromStorage();
      
      // Remove the item
      const updatedItems = currentItems.filter((item) => item.productId !== productId);
      
      // Save to localStorage
      saveCartItemsToStorage(updatedItems);
      
      // Update Redux store
      dispatch(setCartItems(updatedItems));
      
    } catch (err: any) {
      console.error('Failed to remove item from cart:', err);
      setError('Failed to remove item from cart');
    }
  };

  const emptyCart = () => {
    try {
      console.log('Clearing cart');
      
      // Clear localStorage
      localStorage.removeItem('cart_items');
      
      // Clear Redux store
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