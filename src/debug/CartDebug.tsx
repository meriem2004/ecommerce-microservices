// src/components/debug/CartDebug.tsx
import React, { useState } from 'react';
import useCart from '../hooks/useCart';
import api from '../services/api';

const CartDebug: React.FC = () => {
  const { items, refreshCart } = useCart();
  const [debugResponse, setDebugResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testCartApiConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create headers with X-User-Email and X-User-Id
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        headers['X-User-Email'] = user.email;
        if (user.id) headers['X-User-Id'] = user.id.toString();
      }
      
      console.log('Testing cart API connection...', headers);
      const response = await api.get('/api/carts/debug', { headers });
      console.log('Cart API debug response:', response.data);
      setDebugResponse(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Cart API connection test failed:', err);
      setError(err.response?.data?.message || 'Connection test failed');
      setLoading(false);
    }
  };

  const addTestItem = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create headers with user information
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        headers['X-User-Email'] = user.email;
        if (user.id) headers['X-User-Id'] = user.id.toString();
      }
      
      // Create a test item
      const testItem = {
        productId: 1, // Use a product ID you know exists
        quantity: 1
      };
      
      console.log('Adding test item to cart:', testItem);
      const response = await api.post('/api/carts/current/items', testItem, { headers });
      console.log('Test item added response:', response.data);
      setDebugResponse(response.data);
      
      // Refresh the cart
      refreshCart();
      
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to add test item:', err);
      setError(err.response?.data?.message || 'Failed to add test item');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-6">
      <h3 className="text-lg font-medium mb-4">Cart Debugging</h3>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={testCartApiConnection}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>
        
        <button
          onClick={addTestItem}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Test Item'}
        </button>
        
        <button
          onClick={refreshCart}
          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Cart'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {debugResponse && (
        <div className="bg-gray-50 p-4 rounded overflow-auto max-h-60 mb-4">
          <p className="font-medium mb-2">Debug Response:</p>
          <pre className="text-xs">{JSON.stringify(debugResponse, null, 2)}</pre>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded overflow-auto max-h-60">
        <p className="font-medium mb-2">Current Cart Items ({items.length}):</p>
        <pre className="text-xs">{JSON.stringify(items, null, 2)}</pre>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>User Info in LocalStorage:</p>
        <pre className="text-xs bg-gray-50 p-2 rounded">
          {JSON.stringify(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : 'No user data', null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CartDebug;