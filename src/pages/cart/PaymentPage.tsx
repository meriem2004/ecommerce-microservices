import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const total = location.state?.total || 0;
  const shippingAddress = location.state?.shippingAddress || '';
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setError('');
    if (!cardNumber.trim()) {
      setError('Card number is required.');
      return;
    }
    setLoading(true);
    try {
      // TODO: Call payment service here
      // await submitPayment({ total, paymentMethod, cardNumber, shippingAddress });
      navigate('/orders'); // Redirect to orders or confirmation
    } catch (e) {
      setError('Failed to process payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>
      <div className="mb-6 text-lg">Total: <span className="font-bold">${total.toFixed(2)}</span></div>
      <div className="mb-4">Shipping Address: {shippingAddress}</div>
      <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
      <select
        className="w-full p-2 border rounded mb-2"
        value={paymentMethod}
        onChange={e => setPaymentMethod(e.target.value)}
      >
        <option value="CREDIT_CARD">Credit Card</option>
        <option value="PAYPAL">PayPal</option>
      </select>
      <input
        type="text"
        className="w-full p-2 border rounded mb-2"
        placeholder="Card Number"
        value={cardNumber}
        onChange={e => setCardNumber(e.target.value)}
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <Button onClick={handlePayment} disabled={loading} fullWidth>
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
      <Button onClick={() => navigate(-1)} variant="outline" className="mt-4" fullWidth>
        Back
      </Button>
    </div>
  );
};

export default PaymentPage; 