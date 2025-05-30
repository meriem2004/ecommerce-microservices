import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { submitPayment } from '../../services/paymentService';
import { STORAGE_KEYS } from '../../config';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const total = location.state?.total || 0;
  const shippingAddress = location.state?.shippingAddress || '';
  const orderId = location.state?.orderId; // Get from previous order creation
  const orderNumber = location.state?.orderNumber; // Get from previous order creation
  
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!user || !token) {
      setError('Please log in to make a payment');
      return;
    }

    console.log('Payment page state:', { total, shippingAddress, orderId, orderNumber });
  }, [total, shippingAddress, orderId, orderNumber]);

  const handlePayment = async () => {
    setError('');
    
    // Basic validation
    if (total <= 0) {
      setError('Invalid payment amount.');
      return;
    }

    // Check if payment is already being processed
    if (loading) {
      return;
    }

    // Payment method specific validation
    if (paymentMethod === 'CREDIT_CARD') {
      if (!cardNumber.trim() || !expiry.trim() || !cvv.trim() || !nameOnCard.trim()) {
        setError('All credit card fields are required.');
        return;
      }
      
      // Basic card number validation
      if (cardNumber.replace(/\s/g, '').length < 13) {
        setError('Invalid card number.');
        return;
      }
      
      // Basic expiry validation
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError('Invalid expiry format. Use MM/YY.');
        return;
      }
      
      // Basic CVV validation
      if (!/^\d{3,4}$/.test(cvv)) {
        setError('Invalid CVV.');
        return;
      }
    }

    if (paymentMethod === 'PAYPAL' && !paypalEmail.trim()) {
      setError('PayPal email is required.');
      return;
    }

    // Check authentication
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!user || !token) {
      setError('Please log in to make a payment');
      return;
    }

    setLoading(true);
    
    try {
      const userData = JSON.parse(user);
      
      // Prepare payment payload
      const paymentData = {
        amount: total,
        paymentMethod,
        userId: userData.id,
        shippingAddress,
        orderId,
        orderNumber,
        // Credit card fields
        ...(paymentMethod === 'CREDIT_CARD' && {
          cardNumber,
          expiry,
          cvv,
          nameOnCard,
        }),
        // PayPal fields
        ...(paymentMethod === 'PAYPAL' && {
          paypalEmail,
          paypalToken: 'mock-token', // In real app, get from PayPal SDK
        }),
      };

      console.log('Processing payment with data:', paymentData);
      
      const response = await submitPayment(paymentData);
      
      console.log('Payment successful:', response.data);
      
      // Navigate to success page
      navigate('/payment-success', { 
        state: { 
          paymentNumber: response.data.paymentNumber,
          amount: total,
          orderNumber: response.data.orderNumber
        } 
      });
      
    } catch (error: any) {
      console.error('Payment error:', error);
      
      // Handle specific error cases
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

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>
      
      <div className="mb-6 text-lg">
        Total: <span className="font-bold">${total.toFixed(2)}</span>
      </div>
      
      <div className="mb-4">
        <strong>Shipping Address:</strong> {shippingAddress}
      </div>
      
      {orderId && (
        <div className="mb-4">
          <strong>Order ID:</strong> {orderId}
        </div>
      )}
      
      {orderNumber && (
        <div className="mb-4">
          <strong>Order Number:</strong> {orderNumber}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
      <select
        className="w-full p-2 border rounded mb-4"
        value={paymentMethod}
        onChange={e => setPaymentMethod(e.target.value)}
      >
        <option value="CREDIT_CARD">Credit Card</option>
        <option value="PAYPAL">PayPal</option>
      </select>

      {paymentMethod === 'CREDIT_CARD' && (
        <div className="space-y-2 mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Name on Card"
            value={nameOnCard}
            onChange={e => setNameOnCard(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Card Number (1234 5678 9012 3456)"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            maxLength={19}
          />
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              placeholder="MM/YY"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              maxLength={5}
            />
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              placeholder="CVV"
              value={cvv}
              onChange={e => setCvv(e.target.value)}
              maxLength={4}
            />
          </div>
        </div>
      )}

      {paymentMethod === 'PAYPAL' && (
        <div className="mb-4">
          <input
            type="email"
            className="w-full p-2 border rounded"
            placeholder="PayPal Email"
            value={paypalEmail}
            onChange={e => setPaypalEmail(e.target.value)}
          />
        </div>
      )}
      
      {error && (
        <div className="text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <Button 
        onClick={handlePayment} 
        disabled={loading || total <= 0} 
        fullWidth
      >
        {loading ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
      </Button>

      <Button 
        onClick={() => navigate(-1)} 
        variant="outline" 
        className="mt-4" 
        fullWidth
      >
        Back
      </Button>
    </div>
  );
};

export default PaymentPage;