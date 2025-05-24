// src/hooks/useCart.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  addItem, 
  updateItemQuantity, 
  removeItem, 
  clearCart, 
  setCartItems,
  setLoading,
  setError
} from '../store/cartSlice';
import { CartItem } from '../types';
import api from '../services/api';
import * as authService from '../services/auth';

const useCart = () => {
  // Redux hooks first
  const dispatch = useDispatch();
  const { items, loading: cartLoading, error: cartError } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Then other hooks
  const verifyToken = useCallback(async () => {
    try {
      const response = await api.get('/api/carts/debug-auth');
      console.log('Token verification response:', response.data);
      return response.data.status === 'Authenticated';
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }, []);

  const fetchCartItems = useCallback(async () => {
    // Check localStorage directly since redux state might not be updated yet
    const isUserAuthenticated = authService.isAuthenticated();
    
    if (!isUserAuthenticated) {
      console.log('fetchCartItems: User not authenticated, skipping API call');
      return;
    }
    
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      console.log('Fetching cart items - isAuthenticated from localStorage:', isUserAuthenticated);
      
      const response = await api.get('/api/carts/current');
      console.log('Cart items response:', response.data);
      
      if (response.data?.items) {
        dispatch(setCartItems(response.data.items));
      }
    } catch (err) {
      console.error('Failed to load cart items:', err);
      let errorMessage = 'Failed to load cart items';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const addToCart = async (item: CartItem) => {
    console.log('Adding to cart from useCart hook:', item);
    
    // Always add to local cart for immediate feedback
    dispatch(addItem(item));
    
    // Check authentication directly from localStorage to avoid state synchronization issues
    const isUserAuthenticated = authService.isAuthenticated(); 
    console.log('Authentication check for addToCart:', { 
      reduxState: isAuthenticated,
      localStorage: isUserAuthenticated
    });
    
    // If authenticated, also send to backend
    if (isUserAuthenticated) {
      try {
        dispatch(setLoading(true));
        
        // Important: Ensure productId is a number
        const addItemRequest = {
          productId: parseInt(item.productId),
          quantity: item.quantity || 1
        };

        console.log('Sending cart request to backend:', addItemRequest);

        const response = await api.post('/api/carts/current/items', addItemRequest);
        
        console.log('Response from backend:', response.data);
        
        if (response.data?.items) {
          dispatch(setCartItems(response.data.items));
          console.log('Updated cart items from backend');
        }
      } catch (apiError) {
        console.error('Failed to sync cart with backend:', apiError);
        dispatch(setError('Failed to sync with server'));
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      console.log('Not authenticated, item only added to local cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    // Always update local cart first
    dispatch(updateItemQuantity({ productId, quantity }));
    
    // Check authentication directly
    const isUserAuthenticated = authService.isAuthenticated();
    
    // If authenticated, also update backend
    if (isUserAuthenticated) {
      try {
        dispatch(setLoading(true));
        
        const cartItem = items.find(item => item.productId.toString() === productId.toString());
        
        if (!cartItem?.id) {
          throw new Error('Cart item not found');
        }

        console.log('Updating quantity on backend:', {
          cartItemId: cartItem.id,
          productId,
          newQuantity: quantity
        });

        const response = await api.put(`/api/carts/current/items/${cartItem.id}`, { quantity });
        
        if (response.data?.items) {
          dispatch(setCartItems(response.data.items));
        }
      } catch (apiError) {
        console.error('Failed to sync quantity update with backend:', apiError);
        dispatch(setError('Failed to update quantity on server'));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    // Always remove from local cart first
    dispatch(removeItem(productId));
    
    // Check authentication directly
    const isUserAuthenticated = authService.isAuthenticated();
    
    // If authenticated, also remove from backend
    if (isUserAuthenticated) {
      try {
        dispatch(setLoading(true));
        
        const cartItem = items.find(item => item.productId.toString() === productId.toString());
        
        if (!cartItem?.id) {
          throw new Error('Cart item not found');
        }

        console.log('Removing item from backend:', {
          cartItemId: cartItem.id,
          productId
        });

        const response = await api.delete(`/api/carts/current/items/${cartItem.id}`);
        
        if (response.data?.items) {
          dispatch(setCartItems(response.data.items));
        }
      } catch (apiError) {
        console.error('Failed to sync item removal with backend:', apiError);
        dispatch(setError('Failed to remove item on server'));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const emptyCart = async () => {
    // Always clear local cart first
    dispatch(clearCart());
    
    // Check authentication directly
    const isUserAuthenticated = authService.isAuthenticated();
    
    // If authenticated, also clear backend cart
    if (isUserAuthenticated) {
      try {
        dispatch(setLoading(true));
        
        console.log('Clearing cart on backend');
        await api.delete('/api/carts/current');
      } catch (apiError) {
        console.error('Failed to sync cart clearing with backend:', apiError);
        dispatch(setError('Failed to clear cart on server'));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    items,
    loading: cartLoading,
    error: cartError,
    addToCart,
    updateQuantity,
    removeFromCart,
    emptyCart,
    getCartTotal,
    getItemCount,
    refreshCart: fetchCartItems,
    clearError: () => dispatch(setError(null))
  };
};

export default useCart;