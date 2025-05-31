import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight,
  Star,
  Timer,
  Gift,
  Zap,
  TrendingUp,
  Users,
  Award,
  Heart,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchProducts, clearProductError, fetchCategories } from '../store/productSlice';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/common/Button';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { API_BASE_URL } from '../config';
import { Category } from '../types';

const CategoryCard: React.FC<{ 
  category: Category;
  gradient: string;
}> = ({ category, gradient }) => {
  // Generate appropriate icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('electronic') || name.includes('tech') || name.includes('phone') || name.includes('computer')) {
      return '📱';
    } else if (name.includes('cloth') || name.includes('fashion') || name.includes('apparel') || name.includes('wear')) {
      return '👕';
    } else if (name.includes('book') || name.includes('read') || name.includes('literature')) {
      return '📚';
    } else if (name.includes('home') || name.includes('house') || name.includes('furniture') || name.includes('garden')) {
      return '🏠';
    } else if (name.includes('sport') || name.includes('fitness') || name.includes('gym') || name.includes('outdoor')) {
      return '⚽';
    } else if (name.includes('beauty') || name.includes('cosmetic') || name.includes('health') || name.includes('care')) {
      return '💄';
    } else if (name.includes('food') || name.includes('grocery') || name.includes('kitchen')) {
      return '🍕';
    } else if (name.includes('toy') || name.includes('game') || name.includes('play')) {
      return '🎮';
    } else if (name.includes('car') || name.includes('auto') || name.includes('vehicle')) {
      return '🚗';
    } else if (name.includes('music') || name.includes('audio') || name.includes('instrument')) {
      return '🎵';
    } else {
      return '🛍️';
    }
  };

  return (
    <Link 
      to={`/products?category=${category.id}`} 
      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className={`h-48 ${gradient} p-6 flex flex-col justify-between`}>
        <div className="flex items-center space-x-3">
          <div className="text-white text-2xl">{getCategoryIcon(category.name)}</div>
          <h3 className="text-white font-bold text-lg">{category.name}</h3>
        </div>
        <div className="flex justify-end">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 group-hover:bg-white/30 transition-colors">
            <ChevronRight className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const DealCard: React.FC<{
  title: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  discount: number;
  timeLeft: string;
}> = ({ title, originalPrice, salePrice, image, discount, timeLeft }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
          -{discount}%
        </div>
        <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full p-1">
          <Heart className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{title}</h4>
      
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xl font-bold text-red-600">${salePrice}</span>
        <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
      </div>
      
      <div className="flex items-center space-x-1 text-orange-400 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
        <span className="text-sm text-gray-600 ml-1">(127)</span>
      </div>
      
      <div className="flex items-center space-x-1 text-red-600 text-sm">
        <Timer className="h-4 w-4" />
        <span>{timeLeft}</span>
      </div>
    </div>
  );
};

const FeaturedProducts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log(`Loading products, attempt #${retryCount + 1}`);
        await dispatch(fetchProducts());
      } catch (err) {
        console.error('Error loading featured products:', err);
      }
    };

    loadProducts();
  }, [dispatch, retryCount]);

  const featuredProducts = products.slice(0, 8);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 w-1/2 rounded mb-2"></div>
            <div className="bg-gray-300 h-10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <h3 className="font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Unable to load products
        </h3>
        <p className="text-sm mt-1">Error: {error}</p>
        <button 
          onClick={() => {
            dispatch(clearProductError());
            setRetryCount(prev => prev + 1);
          }}
          className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-700">No featured products available at the moment.</p>
        <button 
          onClick={() => {
            dispatch(clearProductError());
            setRetryCount(prev => prev + 1);
          }}
          className="mt-4 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700"
        >
          Retry Loading Products
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const FeaturedCategories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state: RootState) => state.products);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log(`Loading categories, attempt #${retryCount + 1}`);
        await dispatch(fetchCategories());
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, [dispatch, retryCount]);

  const gradients = [
    "bg-gradient-to-br from-blue-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-rose-600",
    "bg-gradient-to-br from-green-500 to-teal-600",
    "bg-gradient-to-br from-orange-500 to-red-600",
    "bg-gradient-to-br from-indigo-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-pink-600",
    "bg-gradient-to-br from-yellow-500 to-orange-600",
    "bg-gradient-to-br from-teal-500 to-green-600"
  ];

  if (categoriesLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <h3 className="font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Unable to load categories
        </h3>
        <p className="text-sm mt-1">Error: {categoriesError}</p>
        <button 
          onClick={() => {
            setRetryCount(prev => prev + 1);
          }}
          className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-700">No categories available at the moment.</p>
      </div>
    );
  }

  // Show up to 6 categories for the homepage
  const displayCategories = categories.slice(0, 6);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {displayCategories.map((category, index) => (
        <CategoryCard 
          key={category.id} 
          category={category}
          gradient={gradients[index % gradients.length]}
        />
      ))}
    </div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.products);

  // Load categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const todaysDeals = [
    {
      title: "Wireless Bluetooth Headphones",
      originalPrice: 99.99,
      salePrice: 59.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      discount: 40,
      timeLeft: "5h 32m"
    },
    {
      title: "Smart Watch Series 8",
      originalPrice: 399.99,
      salePrice: 299.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      discount: 25,
      timeLeft: "8h 15m"
    },
    {
      title: "Ultra HD 4K Camera",
      originalPrice: 799.99,
      salePrice: 599.99,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
      discount: 25,
      timeLeft: "12h 45m"
    },
    {
      title: "Gaming Laptop Pro",
      originalPrice: 1299.99,
      salePrice: 999.99,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      discount: 23,
      timeLeft: "3h 20m"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Welcome to Shop<span className="text-orange-400">Hub</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
              Discover millions of products at unbeatable prices with fast, free shipping
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-8 py-3"
                onClick={() => navigate('/products')}
              >
                Shop Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3"
                onClick={() => navigate('/deals')}
              >
                Today's Deals
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 animate-bounce">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
            <Gift className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        <div className="absolute bottom-10 right-10 animate-pulse">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
            <Zap className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Tag className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          <Link to="/products" className="text-purple-600 hover:text-purple-800 font-medium flex items-center group">
            View All 
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <ErrorBoundary 
          fallback={
            <div className="p-8 border border-red-300 bg-red-50 rounded-lg text-center">
              <h3 className="text-red-800 font-medium text-lg mb-2">Unable to load categories</h3>
              <p className="text-red-700">We're having trouble displaying categories right now.</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Refresh Page
              </Button>
            </div>
          }
        >
          <FeaturedCategories />
        </ErrorBoundary>
      </div>

      {/* Today's Deals Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">
                LIMITED TIME
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Today's Deals</h2>
            </div>
            <Link to="/deals" className="text-red-600 hover:text-red-800 font-medium flex items-center group">
              See All Deals 
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {todaysDeals.map((deal, index) => (
              <DealCard key={index} {...deal} />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose ShopHub?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 group-hover:bg-blue-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 transition-colors">
                <Truck className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $35. Fast delivery worldwide.</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-green-100 group-hover:bg-green-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 transition-colors">
                <ShieldCheck className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Your data is protected with industry-leading security.</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-purple-100 group-hover:bg-purple-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 transition-colors">
                <CreditCard className="h-8 w-8 text-purple-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy. No questions asked.</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-orange-100 group-hover:bg-orange-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 transition-colors">
                <Users className="h-8 w-8 text-orange-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer service support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            </div>
            <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium flex items-center group">
              View All Products 
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <ErrorBoundary 
            fallback={
              <div className="p-8 border border-red-300 bg-red-50 rounded-lg text-center">
                <h3 className="text-red-800 font-medium text-lg mb-2">Something went wrong</h3>
                <p className="text-red-700">We're having trouble displaying products right now.</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                >
                  Refresh Page
                </Button>
              </div>
            }
          >
            <FeaturedProducts />
          </ErrorBoundary>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Latest Deals
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Subscribe to our newsletter and never miss out on exclusive offers and new arrivals.
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg sm:rounded-r-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <Button className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-6 py-3 rounded-r-lg sm:rounded-l-none rounded-l-lg mt-2 sm:mt-0">
              Subscribe
            </Button>
          </div>
          
          <p className="text-blue-200 text-sm mt-4">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center space-x-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-gray-300">
              <Award className="h-6 w-6 text-yellow-400" />
              <span className="text-sm">Trusted by 10M+ customers</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <ShieldCheck className="h-6 w-6 text-green-400" />
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Truck className="h-6 w-6 text-blue-400" />
              <span className="text-sm">Free shipping worldwide</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Star className="h-6 w-6 text-orange-400" />
              <span className="text-sm">4.8/5 customer rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;