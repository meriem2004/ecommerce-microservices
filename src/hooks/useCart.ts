// src/hooks/useCart.ts
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addItem, updateItemQuantity, removeItem, clearCart, setCartItems } from '../store/cartSlice';
import { CartItem } from '../types';
import api from '../services/api';

const useCart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Fetch cart items from backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/carts/current');
      dispatch(setCartItems(response.data.items));
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load cart items');
      setLoading(false);
    }
  };

  const addToCart = async (item: CartItem) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const response = await api.post('/api/carts/current/items', {
          productId: item.productId,
          quantity: item.quantity
        });
        dispatch(setCartItems(response.data.items));
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to add item to cart');
        setLoading(false);
      }
    } else {
      // Use local storage for non-authenticated users
      dispatch(addItem(item));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        // Find the cart item ID from the items array
        const cartItem = items.find(item => item.productId === productId);
        if (!cartItem || !cartItem.id) {
          throw new Error('Cart item not found');
        }
        
        const response = await api.put(`/api/carts/current/items/${cartItem.id}`, {
          quantity
        });
        dispatch(setCartItems(response.data.items));
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update item quantity');
        setLoading(false);
      }
    } else {
      // Use local storage for non-authenticated users
      dispatch(updateItemQuantity({ productId, quantity }));
    }
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        // Find the cart item ID from the items array
        const cartItem = items.find(item => item.productId === productId);
        if (!cartItem || !cartItem.id) {
          throw new Error('Cart item not found');
        }
        
        const response = await api.delete(`/api/carts/current/items/${cartItem.id}`);
        dispatch(setCartItems(response.data.items));
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to remove item from cart');
        setLoading(false);
      }
    } else {
      // Use local storage for non-authenticated users
      dispatch(removeItem(productId));
    }
  };

  const emptyCart = async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        await api.delete('/api/carts/current');
        dispatch(clearCart());
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to clear cart');
        setLoading(false);
      }
    } else {
      // Use local storage for non-authenticated users
      dispatch(clearCart());
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get the total number of items in the cart
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    items,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    emptyCart,
    getCartTotal,
    getItemCount,
    refreshCart: fetchCartItems
  };
};

export default useCart;