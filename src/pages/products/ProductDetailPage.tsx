import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchProductById, clearCurrentProduct } from '../../store/productSlice';
import useCart from '../../hooks/useCart';
import Button from '../../components/common/Button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state: RootState) => state.products);
  const { addToCart } = useCart();
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
    }
  };
  
  if (loading) {
    return (
      <div className="w-full py-20">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-300 w-1/2 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 w-1/3 rounded mb-6"></div>
          <div className="h-32 bg-gray-300 rounded mb-6"></div>
          <div className="h-12 bg-gray-300 w-1/3 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Error: {error}
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p>Product not found</p>
      </div>
    );
  }
  
  // Determine if product is in stock based on quantity
  const inStock = product.inStock !== undefined 
    ? product.inStock 
    : (product.quantity > 0);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button 
        onClick={() => window.history.back()} 
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Products
      </button>
      
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Product image */}
        <div className="lg:col-span-1 mb-8 lg:mb-0">
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.imageUrl || "https://via.placeholder.com/600"}
              alt={product.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>
        
        {/* Product details */}
        <div className="lg:col-span-1">
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {product.name}
          </h1>
          
          <div className="mt-4">
            <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
            
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              
              {product.category && (
                <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.category.name}
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <div className="mt-2 text-gray-700 space-y-4">
              <p>{product.description}</p>
            </div>
          </div>
          
          <div className="mt-8">
            <Button
              onClick={handleAddToCart}
              fullWidth
              disabled={!inStock}
              className="flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;