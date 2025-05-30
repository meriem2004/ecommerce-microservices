import api from './api';
import { STORAGE_KEYS } from '../config';

interface CreditCardDetails {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

interface PaypalDetails {
  email: string;
  token: string;
}

interface PaymentRequest {
  orderId?: number;
  orderNumber?: string;
  userId: number;
  amount: number;
  paymentMethod: string;
  creditCardDetails?: CreditCardDetails;
  paypalDetails?: PaypalDetails;
}

export const submitPayment = async (paymentData: {
  amount: number;
  paymentMethod: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  nameOnCard?: string;
  userId: number;
  shippingAddress: string;
  orderId?: number;
  orderNumber?: string;
  paypalEmail?: string;
  paypalToken?: string;
}) => {
  try {
    // Get user data from localStorage
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) {
      throw new Error('User not found. Please log in again.');
    }

    const user = JSON.parse(userStr);
    if (!user.id) {
      throw new Error('User ID not found. Please log in again.');
    }

    let paymentRequest: PaymentRequest = {
      userId: user.id,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
    };

    // Add order information if available
    if (paymentData.orderId) {
      paymentRequest.orderId = paymentData.orderId;
    }
    if (paymentData.orderNumber) {
      paymentRequest.orderNumber = paymentData.orderNumber;
    }

    // Handle Credit Card payment
    if (paymentData.paymentMethod === 'CREDIT_CARD') {
      if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv || !paymentData.nameOnCard) {
        throw new Error('All credit card fields are required');
      }

      // Parse expiry (MM/YY format)
      const [month, year] = paymentData.expiry.split('/');
      if (!month || !year) {
        throw new Error('Invalid expiry format. Use MM/YY');
      }

      paymentRequest.creditCardDetails = {
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''), // Remove spaces
        cardHolderName: paymentData.nameOnCard,
        expiryMonth: month.padStart(2, '0'),
        expiryYear: year.length === 2 ? '20' + year : year,
        cvv: paymentData.cvv,
      };
    }

    // Handle PayPal payment
    if (paymentData.paymentMethod === 'PAYPAL') {
      paymentRequest.paypalDetails = {
        email: paymentData.paypalEmail || user.email || '',
        token: paymentData.paypalToken || 'mock-paypal-token', // In real app, get from PayPal SDK
      };
    }

    console.log('Submitting payment with payload:', paymentRequest);

    const response = await api.post('/api/payments', paymentRequest);
    console.log('Payment processed successfully:', response.data);
    
    return response;
    
  } catch (error: any) {
    console.error('Error processing payment:', error);
    
    // Provide more specific error messages
    if (error.response?.status === 403) {
      throw new Error('Access denied. Please ensure you are logged in with proper permissions.');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    } else if (error.response?.status === 404) {
      throw new Error('Payment service not available. Please try again later.');
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error(error.message || 'Failed to process payment. Please try again.');
    }
  }
};