// src/hooks/useCart.ts
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addItem, updateItemQuantity, removeItem, clearCart, setCartItems } from '../store/cartSlice';
import { CartItem } from '../types';
import { STORAGE_KEYS } from '../config';
import api from '../services/api';

const useCart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Load cart on mount - prioritize backend if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, fetching cart from backend');
      fetchCartFromBackend();
    } else {
      console.log('User not authenticated, loading cart from localStorage');
      const savedItems = getCartItemsFromStorage();
      if (savedItems.length > 0) {
        dispatch(setCartItems(savedItems));
      }
    }
  }, [dispatch, isAuthenticated, user]);

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

  // Fetch cart from backend
  const fetchCartFromBackend = async () => {
    if (!isAuthenticated) {
      console.log('Not authenticated, skipping backend fetch');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching cart from backend...');
      const response = await api.get('/api/carts/current');
      console.log('Backend cart response:', response.data);
      
      const backendItems = response.data.items || [];
      
      // Convert backend format to frontend format
      const convertedItems: CartItem[] = backendItems.map((item: any) => ({
        id: item.id,
        productId: item.productId.toString(),
        name: item.productName,
        price: parseFloat(item.price),
        quantity: item.quantity,
        imageUrl: item.imageUrl || undefined
      }));
      
      console.log('Converted backend items:', convertedItems);
      dispatch(setCartItems(convertedItems));
      saveCartAndItemsToStorage(convertedItems);
      
    } catch (err: any) {
      console.error('Failed to fetch cart from backend:', err);
      setError('Failed to load cart from server');
      
      // Fallback to localStorage
      const savedItems = getCartItemsFromStorage();
      if (savedItems.length > 0) {
        dispatch(setCartItems(savedItems));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = () => {
    if (isAuthenticated && user) {
      fetchCartFromBackend();
    } else {
      console.log('Refreshing cart from localStorage');
      const savedItems = getCartItemsFromStorage();
      dispatch(setCartItems(savedItems));
    }
  };

  const addToCart = async (item: CartItem) => {
    try {
      console.log('Adding item to cart:', item);
      setLoading(true);
      setError(null);

      if (isAuthenticated && user) {
        // Add to backend
        const response = await api.post('/api/carts/current/items', {
          productId: parseInt(item.productId),
          name: item.name,
          price: item.price,
          quantity: item.quantity
        });
        
        console.log('Backend add response:', response.data);
        
        // Update Redux store with backend response
        const backendItems = response.data.items || [];
        const convertedItems: CartItem[] = backendItems.map((backendItem: any) => ({
          id: backendItem.id,
          productId: backendItem.productId.toString(),
          name: backendItem.productName,
          price: parseFloat(backendItem.price),
          quantity: backendItem.quantity,
          imageUrl: backendItem.imageUrl || undefined
        }));
        
        dispatch(setCartItems(convertedItems));
        saveCartAndItemsToStorage(convertedItems);
      } else {
        // Add to localStorage only
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
      }
    } catch (err: any) {
      console.error('Failed to add item to cart:', err);
      setError('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      console.log(`Updating quantity for product ${productId} to ${quantity}`);
      setLoading(true);
      setError(null);

      if (isAuthenticated && user) {
        // Update on backend
        const response = await api.put(`/api/carts/current/items/${productId}`, {
          quantity: quantity
        });
        
        console.log('Backend update response:', response.data);
        
        // Update Redux store with backend response
        const backendItems = response.data.items || [];
        const convertedItems: CartItem[] = backendItems.map((backendItem: any) => ({
          id: backendItem.id,
          productId: backendItem.productId.toString(),
          name: backendItem.productName,
          price: parseFloat(backendItem.price),
          quantity: backendItem.quantity,
          imageUrl: backendItem.imageUrl || undefined
        }));
        
        dispatch(setCartItems(convertedItems));
        saveCartAndItemsToStorage(convertedItems);
      } else {
        // Update localStorage only
        const currentItems = getCartItemsFromStorage();
        const updatedItems = currentItems.map((item) => {
          if (item.productId === productId) {
            return { ...item, quantity };
          }
          return item;
        });
        saveCartAndItemsToStorage(updatedItems);
        dispatch(setCartItems(updatedItems));
      }
    } catch (err: any) {
      console.error('Failed to update item quantity:', err);
      setError('Failed to update item quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      console.log(`Removing product ${productId} from cart`);
      setLoading(true);
      setError(null);

      if (isAuthenticated && user) {
        // Remove from backend
        const response = await api.delete(`/api/carts/current/items/${productId}`);
        
        console.log('Backend remove response:', response.data);
        
        // Update Redux store with backend response
        const backendItems = response.data.items || [];
        const convertedItems: CartItem[] = backendItems.map((backendItem: any) => ({
          id: backendItem.id,
          productId: backendItem.productId.toString(),
          name: backendItem.productName,
          price: parseFloat(backendItem.price),
          quantity: backendItem.quantity,
          imageUrl: backendItem.imageUrl || undefined
        }));
        
        dispatch(setCartItems(convertedItems));
        saveCartAndItemsToStorage(convertedItems);
      } else {
        // Remove from localStorage only
        const currentItems = getCartItemsFromStorage();
        const updatedItems = currentItems.filter((item) => item.productId !== productId);
        saveCartAndItemsToStorage(updatedItems);
        dispatch(setCartItems(updatedItems));
      }
    } catch (err: any) {
      console.error('Failed to remove item from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const emptyCart = async () => {
    try {
      console.log('Clearing cart');
      setLoading(true);
      setError(null);

      if (isAuthenticated && user) {
        // Clear on backend
        const response = await api.delete('/api/carts/current');
        console.log('Backend clear response:', response.data);
        
        // Clear Redux store
        dispatch(clearCart());
        localStorage.removeItem('cart_items');
        localStorage.removeItem('cart');
      } else {
        // Clear localStorage only
        localStorage.removeItem('cart_items');
        localStorage.removeItem('cart');
        dispatch(clearCart());
      }
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
    } finally {
      setLoading(false);
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
    items: items || [],
    loading,
    error,
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