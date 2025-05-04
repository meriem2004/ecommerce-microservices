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
  },
});

export const { addItem, updateItemQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;