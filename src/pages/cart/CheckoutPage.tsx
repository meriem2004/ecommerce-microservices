import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { submitOrder } from '../../services/orderService';
import { STORAGE_KEYS } from '../../config';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];
  const total = location.state?.total || 0;
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // For demonstration, log the cart and total
  React.useEffect(() => {
    console.log('Checkout page cart:', cart);
    console.log('Checkout page total:', total);
    
    // Validate cart items have required fields
    const invalidItems = cart.filter((item: any) => !item.productId && !item.id);
    if (invalidItems.length > 0) {
      console.error('Invalid cart items found:', invalidItems);
      setError('Some cart items are missing product information. Please refresh your cart.');
    }
  }, [cart, total]);

  const handleValidateOrder = async () => {
    setError('');
    
    // Validation
    if (!shippingAddress.trim()) {
      setError('Shipping address is required.');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty.');
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
      
      const response = await submitOrder({
        cart,
        total,
        shippingAddress: shippingAddress.trim(),
      });
      
      console.log('Order created successfully:', response.data);
      
      // Navigate to payment page with order details
      navigate('/payment', { 
        state: { 
          total,
          shippingAddress: shippingAddress.trim(),
          orderId: response.data.id,
          orderNumber: response.data.orderNumber,
          orderData: response.data
        } 
      });
      
    } catch (error: any) {
      console.error('Order creation error:', error);
      setError(error.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
      <div className="bg-gray-100 p-4 rounded mb-4">
        {cart.map((item: any, index: number) => (
          <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-600 ml-2">x{item.quantity}</span>
            </div>
            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <div className="mb-6 text-lg">
        Total: <span className="font-bold">${total.toFixed(2)}</span>
      </div>

      <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
      <textarea
        className="w-full p-2 border rounded mb-2 min-h-[100px]"
        placeholder="Enter your complete shipping address including street, city, state, zip code"
        value={shippingAddress}
        onChange={e => setShippingAddress(e.target.value)}
      />
      
      {error && (
        <div className="text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <Button 
        onClick={handleValidateOrder} 
        disabled={loading || !shippingAddress.trim() || cart.length === 0} 
        fullWidth
      >
        {loading ? 'Creating Order...' : 'Continue to Payment'}
      </Button>

      <Button 
        onClick={() => navigate('/cart')} 
        variant="outline" 
        className="mt-4" 
        fullWidth
      >
        Back to Cart
      </Button>
    </div>
  );
};

export default CheckoutPage;