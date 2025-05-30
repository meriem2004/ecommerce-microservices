// src/pages/cart/CartPage.tsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import CartItemRow from '../../components/cart/CartItemRow';
import Button from '../../components/common/Button';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';

const CartPage: React.FC = () => {
  const { 
    items, 
    loading, 
    error, 
    getCartTotal, 
    emptyCart, 
    refreshCart,
    updateQuantity, 
    removeFromCart 
  } = useCart();
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Refresh cart data when the component mounts or authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      // Log cart data for debugging
      console.log('Proceeding to checkout with cart:', items, 'Total:', getCartTotal());
      // Pass cart data to checkout page
      navigate('/checkout', { state: { cart: items, total: getCartTotal() } });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
        <h3 className="font-medium">Error loading cart</h3>
        <p className="text-sm mt-1">{error}</p>
        <p className="mt-3">
          <Link to="/products" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </p>
      </div>
    );
  }
  
  // Add null check to prevent the error
  if (!items || items.length === 0) {
    return (
      <div className="pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
        
        {/* User information section - only for authenticated users */}
        {isAuthenticated && user && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Hello, {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Connection status indicator */}
        {isAuthenticated ? (
          <div className="mb-4 text-sm text-green-600 bg-green-50 rounded-md px-3 py-2 inline-block">
            ✓ Connected to your account
          </div>
        ) : (
          <div className="mb-4 text-sm text-yellow-600 bg-yellow-50 rounded-md px-3 py-2 inline-block">
            ℹ Using local cart - <Link to="/login" className="underline">login</Link> to sync with your account
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm p-6 text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products">
            <Button className="mt-6">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
      
      {/* User information section - only for authenticated users */}
      {isAuthenticated && user && (
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Hello, {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Connection status indicator */}
      {isAuthenticated ? (
        <div className="mb-4 text-sm text-green-600 bg-green-50 rounded-md px-3 py-2 inline-block">
          ✓ Connected to your account
        </div>
      ) : (
        <div className="mb-4 text-sm text-yellow-600 bg-yellow-50 rounded-md px-3 py-2 inline-block">
          ℹ Using local cart - <Link to="/login" className="underline">login</Link> to sync with your account
        </div>
      )}
      
      <div className="lg:grid lg:grid-cols-3 lg:gap-x-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 lg:mb-0">
            <div className="flow-root">
              <div className="pb-2 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Items ({items.length})</h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id || `${item.productId}-${item.name}`} className="py-4">
                    <div className="flex items-center space-x-4">
                      {/* Product image */}
                      <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                            No image
                          </div>
                        )}
                      </div>
                      
                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                      </div>
                      
                      {/* Quantity controls */}
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.productId.toString(), Math.max(1, item.quantity - 1))}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                          disabled={item.quantity <= 1}
                        >
                          <span className="sr-only">Decrease</span>
                          <span className="block h-5 w-5 text-center font-bold">-</span>
                        </button>
                        
                        <span className="text-gray-700 w-8 text-center">{item.quantity}</span>
                        
                        <button 
                          onClick={() => updateQuantity(item.productId.toString(), item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                        >
                          <span className="sr-only">Increase</span>
                          <span className="block h-5 w-5 text-center font-bold">+</span>
                        </button>
                      </div>
                      
                      {/* Total and remove */}
                      <div className="text-right">
                        <p className="text-base font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <button 
                          onClick={() => removeFromCart(item.productId.toString())}
                          className="text-sm text-red-600 hover:text-red-500 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={emptyCart}
                  className="text-sm"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="flow-root">
              <dl className="text-sm">
                <div className="flex items-center justify-between py-2">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">${getCartTotal().toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-gray-200">
                  <dt className="text-base font-medium text-gray-900">Order total</dt>
                  <dd className="text-base font-medium text-gray-900">${getCartTotal().toFixed(2)}</dd>
                </div>
              </dl>
              
              <div className="mt-6">
                <Button
                  onClick={handleCheckout}
                  fullWidth
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  to="/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;