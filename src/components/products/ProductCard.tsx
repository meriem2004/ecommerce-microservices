// src/components/products/ProductCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '../../types';
import useCart from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Ensure product is valid to prevent errors
  if (!product || typeof product !== 'object') {
    console.error('Invalid product data received:', product);
    return null;
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Create a cart item from the product
    const cartItem = {
      productId: product.id.toString(), // Keep as string, conversion happens in useCart
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl ?? undefined // Handle undefined image
    };
    
    console.log('Adding to cart:', cartItem);
    
    // Add to cart
    try {
      addToCart(cartItem);
      
      // Show success feedback
      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-900">${product.price?.toFixed(2) ?? 'N/A'}</p>
          
          {/* Show out of stock label if no quantity */}
          {(!product.quantity || product.quantity <= 0) && (
            <span className="px-2 py-1 text-xs text-red-600 bg-red-100 rounded-md">
              Out of stock
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.quantity || product.quantity <= 0 || isAdding}
          className={`mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${addSuccess 
              ? 'bg-green-600' 
              : (!product.quantity || product.quantity <= 0 || isAdding)
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isAdding ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : addSuccess ? (
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Added!
            </span>
          ) : (
            <span className="flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to cart
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;