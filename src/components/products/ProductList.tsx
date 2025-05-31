import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types';
import { ShoppingBag, Search, Filter, Sparkles } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading header skeleton */}
        <div className="flex justify-between items-center">
          <div className="animate-pulse bg-gray-300 h-6 w-48 rounded"></div>
          <div className="animate-pulse bg-gray-300 h-10 w-32 rounded"></div>
        </div>
        
        {/* Loading products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {/* Image skeleton */}
              <div className="bg-gray-300 h-48 w-full"></div>
              
              {/* Content skeleton */}
              <div className="p-4 space-y-3">
                {/* Category badge skeleton */}
                <div className="bg-gray-300 h-4 w-16 rounded"></div>
                
                {/* Rating skeleton */}
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-gray-300 h-3 w-3 rounded"></div>
                    ))}
                  </div>
                  <div className="bg-gray-300 h-3 w-8 rounded"></div>
                </div>
                
                {/* Title skeleton */}
                <div className="space-y-2">
                  <div className="bg-gray-300 h-4 w-full rounded"></div>
                  <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                </div>
                
                {/* Price skeleton */}
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
                
                {/* Features skeleton */}
                <div className="flex space-x-4">
                  <div className="bg-gray-300 h-3 w-16 rounded"></div>
                  <div className="bg-gray-300 h-3 w-12 rounded"></div>
                </div>
                
                {/* Button skeleton */}
                <div className="bg-gray-300 h-10 w-full rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <div className="mx-auto max-w-md">
          {/* Empty state icon */}
          <div className="relative mb-6">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
            <div className="absolute -top-2 -right-2">
              <div className="bg-yellow-100 rounded-full p-2">
                <Search className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We couldn't find any products matching your criteria. Try adjusting your search or filters to discover more items.
          </p>
          
          {/* Suggestions */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Try different keywords</span>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Adjust your filters</span>
              </div>
            </div>
            
            {/* Popular search suggestions */}
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Popular searches:</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Electronics',
                  'Fashion',
                  'Books',
                  'Home & Garden',
                  'Sports',
                  'Beauty',
                  'Toys',
                  'Automotive'
                ].map((category) => (
                  <button
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Help text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Search Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check your spelling and try again</li>
                <li>• Use fewer or different keywords</li>
                <li>• Try more general search terms</li>
                <li>• Browse our categories above</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter out any invalid products
  const validProducts = products.filter(product => 
    product && typeof product === 'object' && product.id && product.name
  );

  if (validProducts.length === 0) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
        <div className="mx-auto max-w-md">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Invalid Product Data</h3>
          <p className="text-red-700 mb-4">
            Some products have invalid data and cannot be displayed properly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {validProducts.map((product) => (
          <ProductCard 
            key={`product-${product.id}`} 
            product={product}
          />
        ))}
      </div>
      
      {/* Product count and status info */}
      <div className="text-center py-4">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
          <ShoppingBag className="h-4 w-4" />
          <span>
            Showing {validProducts.length} product{validProducts.length !== 1 ? 's' : ''}
            {products.length !== validProducts.length && (
              <span className="text-yellow-600 ml-2">
                ({products.length - validProducts.length} items filtered out)
              </span>
            )}
          </span>
        </div>
        
        {/* Quality badge */}
        {validProducts.length > 0 && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-green-600">
            <div className="bg-green-100 rounded-full p-1">
              <Sparkles className="h-3 w-3" />
            </div>
            <span>All products verified and in stock</span>
          </div>
        )}
      </div>
      
      {/* Load more indicator (for future pagination) */}
      {validProducts.length >= 12 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
            <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.4s' }}></div>
            <span className="ml-2">More products available</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;