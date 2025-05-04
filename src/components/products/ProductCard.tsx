import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Button from '../common/Button';
import useCart from '../../hooks/useCart';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="h-48 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          fullWidth
          size="sm"
          className="mt-2 transition-all duration-300"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
      {!product.inStock && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          Out of Stock
        </div>
      )}
    </div>
  );
};

export default ProductCard;