import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  Search, 
  MapPin, 
  Heart,
  Bell,
  Globe,
  ChevronDown,
  Package,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { getItemCount } from '../../utils/cart';
import { STORAGE_KEYS } from '../../config';
import { getCategories } from '../../services/product';
import { Category } from '../../types';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Direct authentication check from localStorage
  const [localAuth, setLocalAuth] = useState({
    isAuthenticated: false,
    user: null
  });
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Check authentication status directly from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      let userData = null;
      
      if (userStr) {
        try {
          userData = JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      setLocalAuth({
        isAuthenticated: !!token && !!userData,
        user: userData
      });
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      let searchUrl = `/products?search=${encodeURIComponent(searchTerm)}`;
      
      // Add category filter if not "All"
      if (selectedCategory !== 'All') {
        const category = categories.find(cat => cat.name === selectedCategory);
        if (category) {
          searchUrl += `&category=${category.id}`;
        }
      }
      
      navigate(searchUrl);
      setSearchTerm('');
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsCategoriesMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (logout) {
      logout();
    }
    
    setLocalAuth({
      isAuthenticated: false,
      user: null
    });
    
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const effectiveIsAuthenticated = isAuthenticated || localAuth.isAuthenticated;
  const effectiveUser = user || localAuth.user;

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* Left side */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1 hover:bg-gray-800 px-2 py-1 rounded cursor-pointer">
                <MapPin className="h-4 w-4" />
                <span>Deliver to {selectedCountry}</span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-6">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center space-x-1 hover:bg-gray-800 px-2 py-1 rounded"
                >
                  <Globe className="h-4 w-4" />
                  <span>{selectedLanguage}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg py-1 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.name);
                          setIsLanguageMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {effectiveIsAuthenticated ? (
                <span className="text-sm">Hello, {effectiveUser?.firstName || 'User'}</span>
              ) : (
                <Link to="/login" className="hover:underline">
                  Hello, Sign in
                </Link>
              )}

              <Link to="/orders" className="hover:underline hidden sm:block">
                Returns & Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 mr-8">
                <div className="text-2xl font-bold text-white">
                  Shop<span className="text-purple-400">Hub</span>
                </div>
              </Link>

              {/* Categories Menu */}
              <div className="hidden lg:block relative">
                <button 
                  onClick={() => setIsCategoriesMenuOpen(!isCategoriesMenuOpen)}
                  className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm font-medium"
                >
                  <Menu className="h-4 w-4" />
                  <span>All Categories</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                
                {isCategoriesMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white text-gray-900 rounded-md shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
                    <Link
                      to="/products"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setIsCategoriesMenuOpen(false)}
                    >
                      All Products
                    </Link>
                    {loadingCategories ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Loading categories...</div>
                    ) : (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/products?category=${category.id}`}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setIsCategoriesMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-stretch h-10">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-200 border-none px-3 py-0 text-gray-900 text-sm rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-full min-w-[80px]"
                  >
                    <option value="All">All</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search ShopHub"
                    className="flex-1 px-4 py-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 border-0 h-full"
                  />
                  <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-600 px-4 py-0 rounded-r-md transition-colors h-full flex items-center justify-center"
                  >
                    <Search className="h-5 w-5 text-white" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-6">
              {/* Wishlist */}
              <Link to="/wishlist" className="hidden md:flex flex-col items-center hover:text-purple-400 transition-colors">
                <Heart className="h-6 w-6" />
                <span className="text-xs">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-center space-x-1 hover:text-purple-400 transition-colors relative">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6" />
                    {getItemCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {getItemCount()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs hidden sm:block">Cart</span>
                </div>
              </Link>

              {/* User Menu */}
              {effectiveIsAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 hover:text-purple-400 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <User className="h-6 w-6" />
                      <div className="flex items-center space-x-1">
                        <span className="text-xs hidden sm:block">Account</span>
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 rounded-md shadow-xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium">{effectiveUser?.firstName} {effectiveUser?.lastName}</p>
                        <p className="text-xs text-gray-500">{effectiveUser?.email}</p>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Your Profile</span>
                      </Link>
                      
                      <Link 
                        to="/orders" 
                        className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        <span>Your Orders</span>
                      </Link>
                      
                      <Link 
                        to="/wishlist" 
                        className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>Your Wishlist</span>
                      </Link>
                      
                      <Link 
                        to="/payments" 
                        className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Payment Methods</span>
                      </Link>
                      
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-sm hover:bg-gray-100 text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-md hover:bg-gray-700"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <div className="bg-gray-700 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 h-10 overflow-x-auto">
            <Link to="/products" className="hover:text-purple-400 whitespace-nowrap">All Products</Link>
            {categories.slice(0, 6).map((category) => (
              <Link 
                key={category.id}
                to={`/products?category=${category.id}`} 
                className="hover:text-purple-400 whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
            <Link to="/deals" className="hover:text-purple-400 whitespace-nowrap text-purple-300">Today's Deals</Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-4 space-y-4">
            <div className="space-y-2">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              
              {/* Mobile Categories */}
              <div className="border-t border-gray-700 pt-2">
                <p className="px-3 py-2 text-sm font-medium text-gray-400">Categories</p>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 pl-6"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              
              <Link
                to="/deals"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 text-purple-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Today's Deals
              </Link>
            </div>
            
            {effectiveIsAuthenticated ? (
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 text-red-400"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-700 pt-4">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-purple-500 text-white text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay for dropdowns */}
      {(isUserMenuOpen || isLanguageMenuOpen || isCategoriesMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsLanguageMenuOpen(false);
            setIsCategoriesMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Header;