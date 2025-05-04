import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import useCart from '../../hooks/useCart';
import { CartItem } from '../../types';

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncreaseQuantity = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    } else {
      removeFromCart(item.productId);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center py-4 border-b border-gray-200">
      <div className="flex-shrink-0 w-20 h-20 mr-4 bg-gray-200 rounded-md overflow-hidden">
        <img
          src={item.imageUrl || "https://via.placeholder.com/80"}
          alt={item.name}
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      <div className="flex-1 min-w-0 sm:mt-0 mt-4">
        <h3 className="text-base font-medium text-gray-900 truncate">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center mt-4 sm:mt-0">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={handleDecreaseQuantity}
            className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-2 py-1 text-gray-900">{item.quantity}</span>
          <button
            onClick={handleIncreaseQuantity}
            className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <button
          onClick={handleRemove}
          className="ml-4 text-gray-500 hover:text-red-500 focus:outline-none"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      
      <div className="font-medium text-gray-900 mt-4 sm:mt-0 sm:ml-6">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItemRow;