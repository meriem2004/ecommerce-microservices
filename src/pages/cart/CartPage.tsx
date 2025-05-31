import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Minus, 
  Plus, 
  X, 
  Heart, 
  Truck, 
  Shield, 
  RotateCcw,
  Gift,
  Tag,
  CreditCard,
  Lock,
  Clock,
  CheckCircle
} from 'lucide-react';
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
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  
  // Refresh cart data when the component mounts or authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      console.log('Proceeding to checkout with cart:', items, 'Total:', getCartTotal());
      navigate('/checkout', { state: { cart: items, total: getCartTotal() } });
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      // Simulate promo code application
      if (promoCode.toLowerCase() === 'save10') {
        setAppliedPromo('SAVE10');
        setShowPromoInput(false);
        setPromoCode('');
      } else {
        alert('Invalid promo code');
      }
    }
  };

  const calculateSubtotal = () => getCartTotal();
  const calculateDiscount = () => appliedPromo === 'SAVE10' ? getCartTotal() * 0.1 : 0;
  const calculateShipping = () => getCartTotal() > 35 ? 0 : 5.99;
  const calculateTax = () => (getCartTotal() - calculateDiscount()) * 0.08;
  const calculateTotal = () => getCartTotal() - calculateDiscount() + calculateShipping() + calculateTax();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 w-48 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6">
                    <div className="flex space-x-4">
                      <div className="bg-gray-300 h-20 w-20 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                        <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                        <div className="bg-gray-300 h-6 w-20 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="bg-gray-300 h-6 w-32 rounded"></div>
                    <div className="bg-gray-300 h-12 w-full rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <h3 className="font-medium">Error loading cart</h3>
            <p className="text-sm mt-1">{error}</p>
            <p className="mt-3">
              <Link to="/products" className="text-blue-600 hover:underline">
                Continue shopping
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
          
          {/* User information section - only for authenticated users */}
          {isAuthenticated && user && (
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
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
          
          {/* Empty cart state */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="text-center py-16 px-6">
              <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
              </p>
              
              <div className="space-y-4">
                <Link to="/products">
                  <Button size="lg" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-8">
                    Start Shopping
                  </Button>
                </Link>
                
                <div className="flex justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping over $35</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="h-4 w-4" />
                    <span>30-day returns</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium">
            Continue Shopping
          </Link>
        </div>
        
        {/* User information section */}
        {isAuthenticated && user && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Signed in</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Items header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Items ({items.length})
                </h2>
                <button
                  onClick={emptyCart}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Cart Items */}
            {items.map((item) => (
              <div key={item.id || `${item.productId}-${item.name}`} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex space-x-4">
                  {/* Product image */}
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-lg overflow-hidden bg-gray-100">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          In stock
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>Save for later</span>
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.productId.toString())}
                            className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                          >
                            <X className="h-4 w-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          ${item.price.toFixed(2)} each
                        </div>
                        
                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.productId.toString(), Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-gray-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.productId.toString(), item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Recommended Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently bought together</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" 
                    alt="Recommended product"
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">Wireless Headphones</h4>
                    <p className="text-sm text-gray-600">$59.99</p>
                    <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                      Add to cart
                    </button>
                  </div>
                </div>
                <div className="flex space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <img 
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100" 
                    alt="Recommended product"
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">Phone Case</h4>
                    <p className="text-sm text-gray-600">$24.99</p>
                    <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                {!showPromoInput && !appliedPromo ? (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium w-full"
                  >
                    <Tag className="h-4 w-4" />
                    <span>Add promo code</span>
                  </button>
                ) : showPromoInput ? (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <Button 
                        onClick={handleApplyPromo}
                        size="sm"
                        variant="outline"
                      >
                        Apply
                      </Button>
                    </div>
                    <button
                      onClick={() => setShowPromoInput(false)}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">{appliedPromo}</span>
                    </div>
                    <button
                      onClick={() => setAppliedPromo(null)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>
              
              {/* Order breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount ({appliedPromo})</span>
                    <span className="font-medium text-green-600">-${calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-600">Shipping</span>
                    {calculateShipping() === 0 && (
                      <span className="text-green-600 text-xs">(Free)</span>
                    )}
                  </div>
                  <span className="font-medium">
                    {calculateShipping() === 0 ? 'FREE' : `${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated tax</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center space-x-2 text-green-600">
                  <Truck className="h-4 w-4" />
                  <span>
                    {calculateShipping() === 0 
                      ? 'FREE shipping included' 
                      : `Add ${(35 - calculateSubtotal()).toFixed(2)} for FREE shipping`
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout guaranteed</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-600">
                  <RotateCcw className="h-4 w-4" />
                  <span>30-day return policy</span>
                </div>
              </div>
              
              {/* Checkout Button */}
              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleCheckout}
                  fullWidth
                  size="lg"
                  className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </Button>
                
                {!isAuthenticated && (
                  <p className="text-xs text-gray-600 text-center">
                    You'll be asked to sign in during checkout
                  </p>
                )}
                
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <span>Secure SSL encryption</span>
                </div>
              </div>
              
              {/* Express Checkout Options */}
              <div className="mt-6 space-y-2">
                <div className="text-center text-sm text-gray-600 mb-3">Or pay with</div>
                <Button
                  variant="outline"
                  fullWidth
                  className="border-gray-300 hover:border-gray-400"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">PayPal</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  className="border-gray-300 hover:border-gray-400"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-black font-medium">Apple</span>
                    <span className="font-bold">Pay</span>
                  </div>
                </Button>
              </div>
              
              {/* Estimated Delivery */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Estimated Delivery</span>
                </div>
                <p className="text-sm text-blue-700">
                  Order within <span className="font-medium">2 hours 34 minutes</span> for delivery by{' '}
                  <span className="font-medium">
                    {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <h3 className="font-medium text-gray-900">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Free shipping on orders over $35</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-8 w-8 text-green-600" />
              <h3 className="font-medium text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-600">Your information is protected</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <RotateCcw className="h-8 w-8 text-purple-600" />
              <h3 className="font-medium text-gray-900">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Gift className="h-8 w-8 text-orange-600" />
              <h3 className="font-medium text-gray-900">Gift Options</h3>
              <p className="text-sm text-gray-600">Perfect for any occasion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;