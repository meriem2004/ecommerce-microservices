import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, CreditCard, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchProducts, clearProductError } from '../store/productSlice';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/common/Button';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { API_BASE_URL } from '../config';

const FeaturedProducts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setDebugInfo({ 
          status: 'loading', 
          timestamp: new Date().toISOString(),
          apiUrl: `${API_BASE_URL}/api/products`,
          authStatus: localStorage.getItem('auth_token') ? 'authenticated' : 'not authenticated'
        });
        
        console.log(`Dispatching fetchProducts, attempt #${retryCount + 1}`);
        const resultAction = await dispatch(fetchProducts());
        
        if (fetchProducts.fulfilled.match(resultAction)) {
          setDebugInfo({ 
            status: 'success', 
            timestamp: new Date().toISOString(),
            count: resultAction.payload.length,
            firstProduct: resultAction.payload[0] || 'none',
            authStatus: localStorage.getItem('auth_token') ? 'authenticated' : 'not authenticated'
          });
          console.log('Products fetched successfully:', resultAction.payload);
        } else {
          setDebugInfo({ 
            status: 'failed', 
            timestamp: new Date().toISOString(),
            error: resultAction.error,
            authStatus: localStorage.getItem('auth_token') ? 'authenticated' : 'not authenticated'
          });
          console.error('Failed to fetch products:', resultAction.error);
        }
      } catch (err) {
        console.error('Error loading featured products:', err);
        setDebugInfo({ 
          status: 'exception', 
          timestamp: new Date().toISOString(),
          error: err,
          authStatus: localStorage.getItem('auth_token') ? 'authenticated' : 'not authenticated'
        });
      }
    };

    loadProducts();
  }, [dispatch, retryCount]);

  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8);

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
        <h3 className="font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Unable to load products
        </h3>
        <p className="text-sm mt-1">Error: {error}</p>
        <div className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">
          <p className="font-medium">Debug Information:</p>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          <p className="mt-1">API URL: {API_BASE_URL}/api/products</p>
          <p>Auth Status: {localStorage.getItem('auth_token') ? 'Logged in' : 'Not logged in'}</p>
        </div>
        <div className="mt-4 flex space-x-4">
          <button 
            onClick={() => {
              dispatch(clearProductError());
              setRetryCount(prev => prev + 1);
            }}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
          >
            Retry Loading
          </button>
          
          <button
            onClick={() => {
              // Direct fetch for debugging
              fetch(`${API_BASE_URL}/api/products`, {
                credentials: 'omit' // Don't send auth credentials
              })
                .then(res => {
                  setDebugInfo({
                    ...debugInfo,
                    directFetch: {
                      status: res.status,
                      ok: res.ok,
                      statusText: res.statusText
                    }
                  });
                  return res.json();
                })
                .then(data => {
                  setDebugInfo({
                    ...debugInfo,
                    directFetch: {
                      ...debugInfo?.directFetch,
                      dataCount: Array.isArray(data) ? data.length : 'not an array',
                      data: Array.isArray(data) ? data.slice(0, 2) : data
                    }
                  });
                })
                .catch(err => {
                  setDebugInfo({
                    ...debugInfo,
                    directFetch: {
                      ...debugInfo?.directFetch,
                      error: err.message
                    }
                  });
                });
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
          >
            Test Direct Fetch
          </button>
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-8 border border-yellow-200 bg-yellow-50 rounded-lg">
        <p className="text-yellow-700">No featured products available at the moment.</p>
        <div className="mt-2 text-xs bg-yellow-100 p-2 rounded overflow-auto max-h-32 mx-auto max-w-lg">
          <p className="font-medium">Debug Information:</p>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          <p className="mt-1">API URL: {API_BASE_URL}/api/products</p>
          <p>Products array length: {products.length}</p>
        </div>
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
    <div>
      {/* Show debug info for development only */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 text-xs rounded">
          <p className="font-medium">Products loaded: {products.length}</p>
          <p>API URL: {API_BASE_URL}/api/products</p>
          <p>Auth Status: {localStorage.getItem('auth_token') ? 'Logged in' : 'Not logged in'}</p>
          <pre className="overflow-auto max-h-20 mt-1">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Rest of the HomePage component remains unchanged
const HomePage: React.FC = () => {
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
        
        <ErrorBoundary 
          fallback={
            <div className="p-4 border border-red-300 bg-red-50 rounded-md">
              <h3 className="text-red-800 font-medium">Something went wrong</h3>
              <p className="text-red-700 mt-1">We're having trouble displaying products right now.</p>
            </div>
          }
        >
          <FeaturedProducts />
        </ErrorBoundary>
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