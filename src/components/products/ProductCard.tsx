// src/components/products/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import useCart from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Ensure product is valid to prevent errors
  if (!product || typeof product !== 'object') {
    console.error('Invalid product data received:', product);
    return null;
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl
    });
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
          disabled={!product.quantity || product.quantity <= 0}
          className={`mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${(!product.quantity || product.quantity <= 0) 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;