// src/components/cart/CartItemRow.tsx
import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import useCart from '../../hooks/useCart';

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // Safety check to prevent errors with invalid data
  if (!item || typeof item !== 'object') {
    console.error('Invalid cart item:', item);
    return null;
  }

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity > 0 && item.id && item.productId) {
      updateQuantity(item.productId.toString(), newQuantity);
    }
  };

  const handleRemoveItem = () => {
    if (item.id && item.productId) {
      removeFromCart(item.productId.toString());
    }
  };

  return (
    <div className="py-6 flex">
      {/* Product image */}
      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name || 'Product'}
            className="w-full h-full object-center object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.name || 'Unnamed Product'}</h3>
            <p className="ml-4">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">${(item.price || 0).toFixed(2)} each</p>
        </div>

        <div className="flex-1 flex items-end justify-between text-sm">
          {/* Quantity selector */}
          <div className="flex items-center">
            <span className="mr-2 text-gray-500">Qty</span>
            <div className="flex border border-gray-300 rounded-md">
              <button
                type="button"
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                onClick={() => handleUpdateQuantity((item.quantity || 1) - 1)}
                disabled={(item.quantity || 0) <= 1}
              >
                -
              </button>
              <span className="px-2 py-1 text-center w-8">{item.quantity || 1}</span>
              <button
                type="button"
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                onClick={() => handleUpdateQuantity((item.quantity || 1) + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Remove button */}
          <div className="flex">
            <button
              type="button"
              className="font-medium text-red-600 hover:text-red-500 flex items-center"
              onClick={handleRemoveItem}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;