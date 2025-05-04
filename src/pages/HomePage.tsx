import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/common/Button';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state: RootState) => state.products);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8);
  
  return (
    <div className="pb-16">
      {/* Hero section */}
      <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-16">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Hero background"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Shop the latest products
          </h1>
          <p className="mt-6 text-xl text-white max-w-2xl">
            Discover our handpicked collection of quality products at competitive prices.
            Fast shipping and excellent customer service guaranteed.
          </p>
          <div className="mt-10 flex space-x-4">
            <Link to="/products">
              <Button size="lg">Shop Now</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="bg-white rounded-xl shadow-sm py-8 px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            <div className="text-center">
              <div className="flex justify-center">
                <ShoppingBag className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Wide Selection</h3>
              <p className="mt-2 text-sm text-gray-500">
                Thousands of products across multiple categories
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center">
                <Truck className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Fast Shipping</h3>
              <p className="mt-2 text-sm text-gray-500">
                Quick delivery to your doorstep
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center">
                <CreditCard className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Secure Payment</h3>
              <p className="mt-2 text-sm text-gray-500">
                Multiple safe payment methods
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center">
                <ShieldCheck className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Buyer Protection</h3>
              <p className="mt-2 text-sm text-gray-500">
                Full refund if you're not satisfied
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured products section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium">
            View all
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-md mb-2"></div>
                <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 w-1/2 rounded mb-2"></div>
                <div className="bg-gray-300 h-10 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      
      {/* Call to action section */}
      <div className="bg-blue-600 rounded-xl shadow-sm py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">Ready to start shopping?</h2>
        <p className="text-lg text-blue-100 mb-8">
          Browse our catalog and find the perfect products for you.
        </p>
        <Link to="/products">
          <Button variant="secondary" size="lg">
            Explore All Products
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;