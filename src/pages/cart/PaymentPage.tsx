import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Shield, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Key,
  User,
  Mail,
  Truck,
  Package,
  Gift,
  Clock,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '../../components/common/Button';
import { submitPayment } from '../../services/paymentService';
import { STORAGE_KEYS } from '../../config';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const total = location.state?.total || 0;
  const shippingAddress = location.state?.shippingAddress || '';
  const orderId = location.state?.orderId;
  const orderNumber = location.state?.orderNumber;
  const shippingInfo = location.state?.shippingInfo || {};
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  
  // Billing address state
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState('');

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!user || !token) {
      setError('Please log in to make a payment');
      return;
    }

    // Pre-fill name if available
    if (shippingInfo.firstName && shippingInfo.lastName) {
      setNameOnCard(`${shippingInfo.firstName} ${shippingInfo.lastName}`);
    }

    console.log('Payment page state:', { total, shippingAddress, orderId, orderNumber });
  }, [total, shippingAddress, orderId, orderNumber, shippingInfo]);

  // Card type detection
  useEffect(() => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) setCardType('visa');
    else if (number.startsWith('5') || number.startsWith('2')) setCardType('mastercard');
    else if (number.startsWith('3')) setCardType('amex');
    else if (number.startsWith('6')) setCardType('discover');
    else setCardType('');
  }, [cardNumber]);

  // Format card number
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  const validateForm = () => {
    if (paymentMethod === 'CREDIT_CARD') {
      if (!cardNumber.trim() || !expiry.trim() || !cvv.trim() || !nameOnCard.trim()) {
        setError('All credit card fields are required.');
        return false;
      }
      
      if (cardNumber.replace(/\s/g, '').length < 13) {
        setError('Please enter a valid card number.');
        return false;
      }
      
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError('Please enter a valid expiry date (MM/YY).');
        return false;
      }
      
      if (!/^\d{3,4}$/.test(cvv)) {
        setError('Please enter a valid CVV.');
        return false;
      }

      // Validate expiry date is not in the past
      const [month, year] = expiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();
      if (expiryDate < currentDate) {
        setError('Card expiry date cannot be in the past.');
        return false;
      }
    }

    if (paymentMethod === 'PAYPAL' && !paypalEmail.trim()) {
      setError('PayPal email is required.');
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    setError('');
    
    if (total <= 0) {
      setError('Invalid payment amount.');
      return;
    }

    if (loading) return;

    if (!validateForm()) return;

    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!user || !token) {
      setError('Please log in to make a payment');
      return;
    }

    setLoading(true);
    
    try {
      const userData = JSON.parse(user);
      
      const paymentData = {
        amount: total,
        paymentMethod,
        userId: userData.id,
        shippingAddress,
        orderId,
        orderNumber,
        ...(paymentMethod === 'CREDIT_CARD' && {
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiry,
          cvv,
          nameOnCard,
          billingAddress: sameAsShipping ? shippingAddress : billingAddress
        }),
        ...(paymentMethod === 'PAYPAL' && {
          paypalEmail,
          paypalToken: 'mock-token'
        }),
      };

      console.log('Processing payment with data:', paymentData);
      
      const response = await submitPayment(paymentData);
      
      console.log('Payment successful:', response.data);
      
      navigate('/payment-success', { 
        state: { 
          paymentNumber: response.data.paymentNumber,
          amount: total,
          orderNumber: response.data.orderNumber
        } 
      });
      
    } catch (error: any) {
      console.error('Payment error:', error);
      
      if (error.message.includes('already has a completed payment')) {
        setError('This order has already been paid. Please check your order history.');
      } else if (error.message.includes('Failed to create unique payment record')) {
        setError('Payment system is busy. Please try again in a moment.');
      } else {
        setError(error.message || 'Failed to process payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">VISA</div>;
      case 'mastercard':
        return <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">MC</div>;
      case 'amex':
        return <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">AMEX</div>;
      case 'discover':
        return <div className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">DISC</div>;
      default:
        return <CreditCard className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          </div>
          
          {/* Progress Indicator */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Shipping</span>
            </div>
            <div className="w-8 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Payment</span>
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
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 rounded-full p-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentMethod === 'CREDIT_CARD'}
                      onChange={() => setPaymentMethod('CREDIT_CARD')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Credit/Debit Card</h3>
                      <p className="text-sm text-gray-600">Visa, MasterCard, Amex, Discover</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'PAYPAL'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('PAYPAL')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentMethod === 'PAYPAL'}
                      onChange={() => setPaymentMethod('PAYPAL')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                      PayPal
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">PayPal</h3>
                      <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Full name as shown on card"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="block w-full pl-10 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {getCardIcon()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={expiry}
                          onChange={handleExpiryChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type={showCvv ? 'text' : 'password'}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="123"
                          maxLength={4}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCvv ? (
                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <div className="flex items-center mb-4">
                      <input
                        id="same-as-shipping"
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="same-as-shipping" className="ml-2 text-sm text-gray-700">
                        Billing address same as shipping address
                      </label>
                    </div>

                    {!sameAsShipping && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900">Billing Address</h4>
                        {/* Add billing address fields here if needed */}
                        <p className="text-sm text-gray-600">
                          Billing address form would go here...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PayPal Form */}
              {paymentMethod === 'PAYPAL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PayPal Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your-email@paypal.com"
                    />
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">PayPal Payment</span>
                    </div>
                    <p className="text-sm text-blue-800 mt-1">
                      You'll be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Security Information */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="font-medium text-green-900">Your payment is secure</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Fraud protection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Privacy protected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order #{orderNumber}</p>
                    <p className="text-xs text-gray-600">Processing after payment</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{shippingAddress}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                    <p className="text-xs text-gray-600">2-3 business days</p>
                  </div>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between text-lg font-semibold text-gray-900 mb-6">
                  <span>Total Amount</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={loading || total <= 0}
                  fullWidth
                  className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold text-lg py-4"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Lock className="h-5 w-5 mr-2" />
                      Pay ${total.toFixed(2)}
                    </span>
                  )}
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-600">
                    By completing your purchase, you agree to our{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <Shield className="h-6 w-6 text-green-600" />
                    <span className="text-xs text-gray-600">Secure</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <span className="text-xs text-gray-600">Protected</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Lock className="h-6 w-6 text-purple-600" />
                    <span className="text-xs text-gray-600">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;