import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
  Globe,
  ChevronUp
} from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Back to Top */}
      <div className="bg-gray-800 hover:bg-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={scrollToTop}
            className="w-full py-4 text-center text-sm font-medium hover:text-orange-400 transition-colors flex items-center justify-center space-x-2"
          >
            <ChevronUp className="h-4 w-4" />
            <span>Back to top</span>
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold">
                Shop<span className="text-orange-400">Hub</span>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted online marketplace for quality products at competitive prices. 
              We're committed to providing exceptional customer service and fast, reliable shipping.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">123 Commerce Street, Tech City, TC 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">1-800-SHOPHUB (746-7482)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">support@shophub.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-gray-300 hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=clothing" className="text-gray-300 hover:text-white transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/products?category=home" className="text-gray-300 hover:text-white transition-colors">
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link to="/products?category=books" className="text-gray-300 hover:text-white transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Today's Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-300 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Account</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
                  Your Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-300 hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="text-gray-300 hover:text-white transition-colors">
                  Recommendations
                </Link>
              </li>
            </ul>
            
            <h4 className="text-lg font-semibold mt-6 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for exclusive deals and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="bg-orange-400 hover:bg-orange-500 text-gray-900 px-6 py-2 rounded-r-md font-medium transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Truck className="h-8 w-8 text-orange-400" />
              <div>
                <h4 className="font-medium">Free Shipping</h4>
                <p className="text-sm text-gray-400">On orders over $35</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-8 w-8 text-orange-400" />
              <div>
                <h4 className="font-medium">Easy Returns</h4>
                <p className="text-sm text-gray-400">30-day policy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-orange-400" />
              <div>
                <h4 className="font-medium">Secure Payment</h4>
                <p className="text-sm text-gray-400">SSL protected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-8 w-8 text-orange-400" />
              <div>
                <h4 className="font-medium">24/7 Support</h4>
                <p className="text-sm text-gray-400">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">United States</span>
                </div>
                <span className="text-gray-600">|</span>
                <span className="text-sm text-gray-400">English</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>

              {/* Payment Methods */}
              <div className="flex items-center space-x-2 border-l border-gray-800 pl-6">
                <span className="text-sm text-gray-400">We accept:</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-white rounded p-1">
                    <CreditCard className="h-4 w-4 text-gray-700" />
                  </div>
                  <div className="bg-blue-600 rounded p-1">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div className="bg-red-600 rounded p-1">
                    <span className="text-white text-xs font-bold">MC</span>
                  </div>
                  <div className="bg-blue-500 rounded p-1">
                    <span className="text-white text-xs font-bold">AMEX</span>
                  </div>
                  <div className="bg-yellow-400 rounded p-1">
                    <span className="text-gray-900 text-xs font-bold">PP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;