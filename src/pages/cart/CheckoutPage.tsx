import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  Truck, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  Package,
  Clock,
  Edit,
  User,
  Phone,
  Home,
  Lock,
  Gift,
  Tag
} from 'lucide-react';
import Button from '../../components/common/Button';
import { submitOrder } from '../../services/orderService';
import { STORAGE_KEYS } from '../../config';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];
  const total = location.state?.total || 0;
  
  // Shipping Information State
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  // UI State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [saveAddress, setSaveAddress] = useState(true);
  const [giftMessage, setGiftMessage] = useState('');
  const [isGift, setIsGift] = useState(false);

  // Load user data if authenticated
  useEffect(() => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    if (user) {
      try {
        const userData = JSON.parse(user);
        setShippingInfo(prev => ({
          ...prev,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || ''
        }));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    console.log('Checkout page cart:', cart);
    console.log('Checkout page total:', total);
    
    // Validate cart items have required fields
    const invalidItems = cart.filter((item: any) => !item.productId && !item.id);
    if (invalidItems.length > 0) {
      console.error('Invalid cart items found:', invalidItems);
      setError('Some cart items are missing product information. Please refresh your cart.');
    }
  }, [cart, total]);

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 0,
      icon: <Truck className="h-5 w-5" />
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 9.99,
      icon: <Package className="h-5 w-5" />
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 19.99,
      icon: <Clock className="h-5 w-5" />
    }
  ];

  const calculateShipping = () => {
    const selected = shippingOptions.find(option => option.id === shippingMethod);
    return selected ? selected.price : 0;
  };

  const calculateTax = () => {
    return (total + calculateShipping()) * 0.08; // 8% tax
  };

  const calculateFinalTotal = () => {
    return total + calculateShipping() + calculateTax();
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    const missing = required.filter(field => !shippingInfo[field as keyof typeof shippingInfo].trim());
    
    if (missing.length > 0) {
      setError(`Please fill in all required fields: ${missing.join(', ')}`);
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // ZIP code validation
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(shippingInfo.zipCode)) {
      setError('Please enter a valid ZIP code');
      return false;
    }

    return true;
  };

  const handleValidateOrder = async () => {
    setError('');
    
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Check authentication
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!user || !token) {
      setError('Please log in to place an order');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Creating order with cart:', cart);
      
      const orderData = {
        cart,
        total: calculateFinalTotal(),
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.apartment ? shippingInfo.apartment + ', ' : ''}${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
        shippingInfo,
        shippingMethod,
        isGift,
        giftMessage: isGift ? giftMessage : ''
      };
      
      const response = await submitOrder(orderData);
      
      console.log('Order created successfully:', response.data);
      
      // Navigate to payment page with order details
      navigate('/payment', { 
        state: { 
          total: calculateFinalTotal(),
          shippingAddress: orderData.shippingAddress,
          orderId: response.data.id,
          orderNumber: response.data.orderNumber,
          orderData: response.data,
          shippingInfo
        } 
      });
      
    } catch (error: any) {
      console.error('Order creation error:', error);
      setError(error.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/cart')}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
          
          {/* Progress Indicator */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Shipping</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Payment</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 rounded-full p-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Home className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={shippingInfo.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="123 Main Street"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.apartment}
                        onChange={(e) => handleInputChange('apartment', e.target.value)}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="New York"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <select
                          value={shippingInfo.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select State</option>
                          <option value="NY">New York</option>
                          <option value="CA">California</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                          {/* Add more states as needed */}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Address Option */}
                <div className="flex items-center">
                  <input
                    id="save-address"
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="save-address" className="ml-2 text-sm text-gray-700">
                    Save this address for future orders
                  </label>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 rounded-full p-2">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Shipping Method</h2>
              </div>

              <div className="space-y-4">
                {shippingOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      shippingMethod === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setShippingMethod(option.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={shippingMethod === option.id}
                          onChange={() => setShippingMethod(option.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="text-blue-600">{option.icon}</div>
                        <div>
                          <h3 className="font-medium text-gray-900">{option.name}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">
                          {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gift Options */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-purple-100 rounded-full p-2">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Gift Options</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="is-gift"
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is-gift" className="ml-2 text-sm font-medium text-gray-700">
                    This is a gift
                  </label>
                </div>

                {isGift && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gift Message (optional)
                    </label>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      rows={3}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Write a personal message for the recipient..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item: any, index: number) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/60'}
                        alt={item.name}
                        className="w-15 h-15 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${calculateFinalTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleValidateOrder}
                  disabled={loading || cart.length === 0}
                  fullWidth
                  className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center space-y-1">
                  <Shield className="h-6 w-6 text-green-600" />
                  <span className="text-xs text-gray-600">SSL Secured</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                  <span className="text-xs text-gray-600">Money Back</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;