import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import CartItemRow from '../../components/cart/CartItemRow';
import Button from '../../components/common/Button';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';

const CartPage: React.FC = () => {
  const { items, getCartTotal, emptyCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center py-16">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400" />
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/products">
          <Button className="mt-6">Continue Shopping</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="pb-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
      
      <div className="lg:grid lg:grid-cols-3 lg:gap-x-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 lg:mb-0">
            <div className="flow-root">
              <div className="pb-2 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Items ({items.length})</h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id}>
                    <CartItemRow item={item} />
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