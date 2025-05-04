import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Shop info */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-bold mb-4">ShopHub</h2>
            <p className="text-gray-300 mb-4">
              Your one-stop shop for all your needs. Quality products, competitive prices, and excellent customer service.
            </p>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white transition">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white transition">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white transition">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p className="mb-2">123 Shop Street</p>
              <p className="mb-2">Anytown, ST 12345</p>
              <p className="mb-2">Email: support@shophub.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-300 text-center">
            &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;