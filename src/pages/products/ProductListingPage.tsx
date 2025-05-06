import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchProducts, searchProducts } from '../../store/productSlice';
import ProductList from '../../components/products/ProductList';
import Button from '../../components/common/Button';

const ProductListingPage: React.FC = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  
  const searchTerm = searchParams.get('search') || '';
  
  useEffect(() => {
    if (searchTerm) {
      dispatch(searchProducts(searchTerm));
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, searchTerm]);
  
  // Get unique categories for filter
  const categories = Array.from(
    new Set(
      products
        .filter(product => product.category)
        .map(product => product.category?.name)
    )
  );
  
  // Filter products by selected category name
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category && product.category.name === selectedCategory)
    : products;
  
  return (
    <div className="pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {searchTerm ? `Search Results: "${searchTerm}"` : 'All Products'}
        </h1>
        <p className="mt-2 text-gray-600">
          {filteredProducts.length} products found
        </p>
      </div>
      
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Mobile filter button */}
        <div className="block lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        {/* Sidebar filters - desktop always visible, mobile conditional */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1 mb-6 lg:mb-0`}>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-4 flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="category-all"
                    name="category"
                    type="radio"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="category-all"
                    className="ml-2 text-sm text-gray-700"
                  >
                    All Categories
                  </label>
                </div>
                
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      name="category"
                      type="radio"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category || '')}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Could add more filters here like price range, etc. */}
          </div>
        </div>
        
        {/* Product grid */}
        <div className="lg:col-span-3">
          {error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              Error: {error}
            </div>
          ) : (
            <ProductList products={filteredProducts} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;