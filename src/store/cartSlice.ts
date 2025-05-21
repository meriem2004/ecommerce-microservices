import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../types';
import * as cartService from '../services/cart';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: cartService.getCartItems(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItems = cartService.addToCart(action.payload);
      state.items = newItems;
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const newItems = cartService.updateCartItemQuantity(productId, quantity);
      state.items = newItems;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const newItems = cartService.removeFromCart(action.payload);
      state.items = newItems;
    },
    clearCart: (state) => {
      cartService.clearCart();
      state.items = [];
    },
    // Add a new action to set cart items from the backend
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      // Also update local storage for offline access
      cartService.saveCartItems(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
});

export const { 
  addItem, 
  updateItemQuantity, 
  removeItem, 
  clearCart, 
  setCartItems,
  setLoading,
  setError 
} = cartSlice.actions;

export default cartSlice.reducer;