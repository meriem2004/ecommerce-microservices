import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addItem, updateItemQuantity, removeItem, clearCart } from '../store/cartSlice';
import { CartItem, Product } from '../types';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  const addToCart = (product: Product, quantity = 1) => {
    const cartItem: CartItem = {
      id: Math.random().toString(36).substring(2, 9), // Generate temporary ID
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    };
    
    dispatch(addItem(cartItem));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch(updateItemQuantity({ productId, quantity }));
    }
  };

  const removeFromCart = (productId: string) => {
    dispatch(removeItem(productId));
  };

  const emptyCart = () => {
    dispatch(clearCart());
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    emptyCart,
    getCartTotal,
    getItemCount,
  };
};

export default useCart;