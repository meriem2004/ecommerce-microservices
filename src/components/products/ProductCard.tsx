// src/components/products/ProductCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Check, 
  Heart, 
  Star, 
  Eye, 
  Truck,
  Shield,
  Zap
} from 'lucide-react';
import { Product } from '../../types';
import useCart from '../../hooks/useCart';
import { STORAGE_KEYS } from '../../config';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Ensure product is valid to prevent errors
  if (!product || typeof product !== 'object') {
    console.error('Invalid product data received:', product);
    return null;
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
    // Create a cart item from the product
    const cartItem = {
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl
    };
    
    console.log('Adding to cart:', cartItem);
    
    // Add to cart
    try {
      addToCart(cartItem);
      
      // Show success feedback
      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
      }, 3000);

      // Only sync with backend if authenticated
      if (!isAuthenticated) {
        setIsAdding(false);
        return;
      }

      // Sync with backend
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      let user = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
      if (user && token) {
        try {
          // Send only the item as AddItemRequest, not the whole cart
          await api.post('/api/carts/current/items', {
            productId: Number(product.id),
            name: product.name,
            price: product.price,
            quantity: 1
          });
        } catch (err) {
          localStorage.setItem('cartSyncError', 'true');
        }
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Calculate discount if available
  const originalPrice = product.originalPrice || product.price * 1.2;
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const hasDiscount = discountPercentage > 0 && discountPercentage < 50;

  // Generate rating if not provided
  const rating = product.rating || (4 + Math.random());
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 200) + 10;

  const inStock = product.quantity > 0;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}
          
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-sm">No image</div>
              </div>
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Stock Status */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className={`absolute top-3 right-3 space-y-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button 
              onClick={handleWishlistToggle}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-sm"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            </button>
            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-sm">
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          {/* Quick Add Button */}
          <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
            isHovered && inStock ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !inStock}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                addSuccess 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white shadow-sm'
              }`}
            >
              {isAdding ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Adding...
                </span>
              ) : addSuccess ? (
                <span className="flex items-center justify-center">
                  <Check className="h-4 w-4 mr-2" />
                  Added!
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Quick Add
                </span>
              )}
            </button>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <div className="mb-2">
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">
              {product.category.name}
            </span>
          </div>
        )}
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({reviewCount})</span>
        </div>
        
        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ${product.price?.toFixed(2) ?? 'N/A'}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Features */}
        <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <Truck className="h-3 w-3" />
            <span>Free shipping</span>
          </div>
          {hasDiscount && (
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>Deal</span>
            </div>
          )}
        </div>
        
        {/* Stock Status and Add to Cart */}
        {!inStock ? (
          <div className="text-center">
            <span className="px-3 py-2 text-xs text-red-600 bg-red-100 rounded-md font-medium">
              Out of stock
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
              addSuccess 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : isAdding
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-orange-400 hover:bg-orange-500 text-gray-900'
            }`}
          >
            {isAdding ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : addSuccess ? (
              <span className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Added to Cart!
              </span>
            ) : (
              <span className="flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to cart
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;