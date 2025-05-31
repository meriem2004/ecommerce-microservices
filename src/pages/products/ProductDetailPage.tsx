import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw,
  Check,
  Minus,
  Plus,
  Share2,
  MessageCircle,
  ArrowLeft,
  ChevronRight,
  MapPin,
  Clock,
  Award,
  Users,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Play,
  Eye,
  Gift,
  Zap,
  Package,
  CreditCard,
  Globe,
  ChevronDown,
  X,
  ExternalLink,
  Info
} from 'lucide-react';
import { RootState } from '../../store';
import { fetchProductById, clearCurrentProduct, fetchProducts } from '../../store/productSlice';
import useCart from '../../hooks/useCart';
import Button from '../../components/common/Button';
import ProductCard from '../../components/products/ProductCard';
import { STORAGE_KEYS } from '../../config';
import api from '../../services/api';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { product, products, loading, error } = useSelector((state: RootState) => state.products);
  const { addToCart } = useCart();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllImages, setShowAllImages] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [deliveryZip, setDeliveryZip] = useState('');
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    
    // Also fetch related products
    dispatch(fetchProducts());
    
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    
    // Create a cart item from the product
    const cartItem = {
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl,
      selectedSize,
      selectedColor
    };
    
    try {
      addToCart(cartItem);
      
      // Show success feedback
      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
      }, 3000);

      // Sync with backend if authenticated
      if (isAuthenticated) {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        let user = null;
        if (userStr) {
          try {
            user = JSON.parse(userStr);
          } catch (e) {
            console.error('Error parsing user from localStorage:', e);
          }
        }
        if (user && token) {
          try {
            await api.post('/api/carts/current/items', {
              productId: Number(product.id),
              name: product.name,
              price: product.price,
              quantity: quantity
            });
          } catch (err) {
            console.error('Failed to sync with backend:', err);
          }
        }
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-4"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-4"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="bg-gray-300 h-96 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-300 h-20 rounded"></div>
                  ))}
                </div>
              </div>
              
              {/* Info skeleton */}
              <div className="space-y-4">
                <div className="bg-gray-300 h-8 w-3/4 rounded"></div>
                <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                <div className="bg-gray-300 h-6 w-1/3 rounded"></div>
                <div className="bg-gray-300 h-32 rounded"></div>
                <div className="bg-gray-300 h-12 rounded"></div>
                <div className="bg-gray-300 h-12 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
            <p className="mb-4">Error: {error}</p>
            <Link to="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for enhanced features
  const productImages = [
    product.imageUrl || "https://via.placeholder.com/600",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600"
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Navy', value: '#1a365d' },
    { name: 'Red', value: '#e53e3e' },
    { name: 'Blue', value: '#3182ce' }
  ];

  const specifications = [
    { label: 'Brand', value: product.brand || 'ShopHub' },
    { label: 'Model', value: `SH-${product.id}` },
    { label: 'Category', value: product.category?.name || 'General' },
    { label: 'SKU', value: `SKU-${product.id}` },
    { label: 'Weight', value: '2.5 lbs' },
    { label: 'Dimensions', value: '10" × 8" × 3"' },
    { label: 'Material', value: 'Premium Quality' },
    { label: 'Warranty', value: '2 years manufacturer warranty' },
    { label: 'Origin', value: 'Made in USA' },
    { label: 'Eco-Friendly', value: 'Yes' }
  ];

  const reviews = [
    {
      id: 1,
      user: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=40",
      rating: 5,
      date: "2 days ago",
      title: "Amazing quality!",
      content: "This product exceeded my expectations. Great build quality and fast shipping. I've been using it for a week now and it works perfectly. Would definitely recommend to anyone looking for a reliable product.",
      helpful: 12,
      verified: true,
      images: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100"]
    },
    {
      id: 2,
      user: "John D.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40",
      rating: 4,
      date: "1 week ago", 
      title: "Good value for money",
      content: "Solid product, works as described. The quality is good for the price point. Shipping was fast and packaging was secure. Only minor issue is that it's slightly smaller than I expected, but still very functional.",
      helpful: 8,
      verified: true,
      images: []
    },
    {
      id: 3,
      user: "Emily R.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40",
      rating: 5,
      date: "2 weeks ago",
      title: "Perfect!",
      content: "Exactly what I was looking for. Fast delivery and excellent customer service. The product matches the description perfectly and the quality is outstanding. Will definitely shop here again!",
      helpful: 15,
      verified: false,
      images: []
    },
    {
      id: 4,
      user: "Michael K.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40",
      rating: 3,
      date: "3 weeks ago",
      title: "Decent product",
      content: "It's okay. Does what it's supposed to do but nothing exceptional. The build quality could be better for the price. Customer service was helpful when I had questions.",
      helpful: 3,
      verified: true,
      images: []
    }
  ];

  const relatedProducts = products.slice(0, 6).filter(p => p.id !== product.id);
  const recentlyViewed = products.slice(6, 12).filter(p => p.id !== product.id);
  
  const inStock = product.inStock !== undefined ? product.inStock : (product.quantity > 0);
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || reviews.length;
  const originalPrice = product.originalPrice || product.price * 1.25;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link to="/products" className="text-blue-600 hover:text-blue-800">Products</Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {product.category && (
            <>
              <Link to={`/products?category=${product.category.name.toLowerCase()}`} className="text-blue-600 hover:text-blue-800">
                {product.category.name}
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </>
          )}
          <span className="text-gray-500 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm group">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Zoom Icon */}
              <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="h-5 w-5 text-gray-700" />
              </button>
              
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}% OFF
                </div>
              )}
              
              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : productImages.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(selectedImage < productImages.length - 1 ? selectedImage + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-5 gap-2">
              {productImages.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            {/* Share Options */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm">Share</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <Camera className="h-4 w-4" />
                  <span className="text-sm">View in AR</span>
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{selectedImage + 1}</span>
                <span>/</span>
                <span>{productImages.length}</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart className={`h-6 w-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {inStock && product.quantity <= 5 && (
                  <span className="text-sm text-orange-600 font-medium">
                    Only {product.quantity} left!
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">2 Year Warranty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-800">30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-800">Best Seller</span>
                </div>
              </div>
            </div>

            {/* Product Variants */}
            {(sizes.length > 0 || colors.length > 0) && (
              <div className="space-y-4">
                {/* Size Selection */}
                {sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">Size:</span>
                      <button
                        onClick={() => setShowSizeGuide(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                            selectedSize === size
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {colors.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-900 block mb-3">
                      Color: {selectedColor && <span className="text-gray-600">({selectedColor})</span>}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            selectedColor === color.name
                              ? 'border-gray-900 scale-110'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {color.value === '#FFFFFF' && (
                            <div className="w-full h-full rounded-full border border-gray-200"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 border-x border-gray-300 min-w-[80px] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity >= (product.quantity || 10)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.quantity} available
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock || isAdding}
                  className={`flex items-center justify-center font-bold transition-all duration-200 ${
                    addSuccess 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-orange-400 hover:bg-orange-500 text-gray-900'
                  }`}
                  size="lg"
                >
                  {isAdding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                      Adding...
                    </>
                  ) : addSuccess ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {inStock ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold"
                >
                  Buy Now
                </Button>
              </div>

              {/* Additional Actions */}
              <div className="flex items-center space-x-4 pt-2">
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
                  <span className="text-sm">Add to Wishlist</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Delivery & Returns</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Enter ZIP code"
                        value={deliveryZip}
                        onChange={(e) => setDeliveryZip(e.target.value)}
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Button size="sm" variant="outline">Check</Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Get accurate delivery estimates</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fast delivery: 2-3 business days</p>
                    <p className="text-sm text-gray-600">Order within 4 hours for today's dispatch</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free returns within 30 days</p>
                    <p className="text-sm text-gray-600">No questions asked return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Highlights */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Why you'll love it</h3>
              <ul className="space-y-2">
                {[
                  "Premium quality materials and construction",
                  "Designed for durability and long-lasting performance",
                  "Easy to use and maintain",
                  "Backed by manufacturer warranty",
                  "Highly rated by thousands of customers"
                ].map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: `Reviews (${reviewCount})` },
                { id: 'qa', label: 'Q&A' },
                { id: 'shipping', label: 'Shipping & Returns' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="px-6 py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    {product.description}
                  </p>
                  
                  {!showFullDescription ? (
                    <button
                      onClick={() => setShowFullDescription(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read more
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <p>
                        This premium product combines cutting-edge technology with exceptional craftsmanship 
                        to deliver an unparalleled user experience. Every detail has been carefully considered 
                        to ensure maximum functionality, durability, and aesthetic appeal.
                      </p>
                      
                      <p>
                        Whether you're a professional looking for reliable performance or someone who 
                        appreciates quality design, this product will exceed your expectations. The 
                        innovative features and robust construction make it suitable for both everyday 
                        use and demanding applications.
                      </p>
                      
                      <p>
                        Backed by our comprehensive warranty and exceptional customer support, you can 
                        purchase with confidence knowing that your investment is protected.
                      </p>
                      
                      <button
                        onClick={() => setShowFullDescription(false)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Show less
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <h4 className="font-semibold mb-4 text-lg">Key Features:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Premium quality materials and construction",
                      "Advanced technology for superior performance",
                      "Ergonomic design for comfort and usability",
                      "Energy efficient and environmentally friendly",
                      "Easy installation and maintenance",
                      "Compatible with existing systems",
                      "Comprehensive warranty coverage",
                      "Award-winning design recognition"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-3 text-lg flex items-center">
                    <Info className="h-5 w-5 text-blue-600 mr-2" />
                    Important Information
                  </h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>• Please read all instructions carefully before use</p>
                    <p>• Keep away from moisture and extreme temperatures</p>
                    <p>• Regular maintenance will extend product lifespan</p>
                    <p>• Contact customer support for any technical questions</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Technical Specifications</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg text-gray-900 border-b border-gray-200 pb-2">
                      General Information
                    </h4>
                    {specifications.slice(0, 5).map((spec, index) => (
                      <div key={index} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <dt className="font-medium text-gray-900">{spec.label}</dt>
                        <dd className="text-gray-700 text-right">{spec.value}</dd>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg text-gray-900 border-b border-gray-200 pb-2">
                      Additional Details
                    </h4>
                    {specifications.slice(5).map((spec, index) => (
                      <div key={index} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <dt className="font-medium text-gray-900">{spec.label}</dt>
                        <dd className="text-gray-700 text-right">{spec.value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-lg mb-4">Compatibility & Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Operating Systems</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Windows 10 or later</li>
                        <li>• macOS 10.15 or later</li>
                        <li>• Linux (Ubuntu 18.04+)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Hardware Requirements</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• 4GB RAM minimum</li>
                        <li>• 2GB storage space</li>
                        <li>• USB 3.0 port</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Certifications</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• FCC Certified</li>
                        <li>• CE Marked</li>
                        <li>• RoHS Compliant</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <Button variant="outline" size="sm">
                    Write a Review
                  </Button>
                </div>
                
                {/* Review Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 mb-3">
                        {rating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 text-lg">{reviewCount} reviews</p>
                      <p className="text-sm text-gray-500 mt-2">Based on verified purchases</p>
                    </div>
                    
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const percentage = Math.random() * 60 + 20; // Mock data
                        const count = Math.floor((percentage / 100) * reviewCount);
                        return (
                          <div key={stars} className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600 w-12">{stars} star</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Review Filters */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-sm font-medium text-gray-900">Filter by:</span>
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option>All reviews</option>
                    <option>5 stars</option>
                    <option>4 stars</option>
                    <option>3 stars</option>
                    <option>2 stars</option>
                    <option>1 star</option>
                    <option>With photos</option>
                    <option>Verified purchases</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option>Most recent</option>
                    <option>Most helpful</option>
                    <option>Highest rating</option>
                    <option>Lowest rating</option>
                  </select>
                </div>
                
                {/* Individual Reviews */}
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.avatar}
                          alt={review.user}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">{review.user}</span>
                                {review.verified && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                    <Check className="h-3 w-3 mr-1" />
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-3">{review.title}</h4>
                          <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>
                          
                          {review.images.length > 0 && (
                            <div className="flex space-x-2 mb-4">
                              {review.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt="Review"
                                  className="w-16 h-16 object-cover rounded border border-gray-200"
                                />
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-6 text-sm">
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              <span>Helpful ({review.helpful})</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
                              <ThumbsDown className="h-4 w-4" />
                              <span>Not helpful</span>
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 transition-colors">
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Button variant="outline">
                    Load More Reviews
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'qa' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-semibold">Questions & Answers</h3>
                  <Button variant="outline" size="sm">
                    Ask a Question
                  </Button>
                </div>
                
                {/* Search Questions */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search questions..."
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Eye className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      question: "What is the warranty period for this product?",
                      answer: "This product comes with a comprehensive 2-year manufacturer warranty covering defects in materials and workmanship. Extended warranty options are also available at checkout.",
                      asker: "Sarah K.",
                      answerer: "ShopHub Team",
                      askDate: "3 days ago",
                      answerDate: "2 days ago",
                      helpful: 15
                    },
                    {
                      question: "Is this compatible with other brands and models?",
                      answer: "Yes, this product is designed to be compatible with most standard accessories and components from other major brands. For specific compatibility questions, please contact our technical support team.",
                      asker: "Mike R.",
                      answerer: "Verified Buyer",
                      askDate: "1 week ago",
                      answerDate: "5 days ago",
                      helpful: 12
                    },
                    {
                      question: "What are the dimensions and weight?",
                      answer: "The product measures 10\" × 8\" × 3\" and weighs approximately 2.5 lbs. These specifications are also available in the product specifications tab above.",
                      asker: "Jennifer L.",
                      answerer: "ShopHub Team",
                      askDate: "2 weeks ago",
                      answerDate: "1 week ago",
                      helpful: 8
                    }
                  ].map((qa, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MessageCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Q: {qa.question}
                            </h4>
                            <div className="text-sm text-gray-600 mb-3">
                              Asked by {qa.asker} • {qa.askDate}
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-8 border-l-2 border-blue-200 pl-6">
                          <p className="text-gray-700 mb-3">
                            A: {qa.answer}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Answered by {qa.answerer} • {qa.answerDate}</span>
                            <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              <span>Helpful ({qa.helpful})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Button variant="outline">
                    See All Questions
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Shipping & Returns</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-lg mb-4 flex items-center">
                      <Truck className="h-5 w-5 text-blue-600 mr-2" />
                      Shipping Information
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Standard Shipping (FREE)</h5>
                        <p className="text-gray-600 mb-2">5-7 business days</p>
                        <p className="text-gray-600">Available on orders over $35</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Express Shipping</h5>
                        <p className="text-gray-600 mb-2">2-3 business days - $9.99</p>
                        <p className="text-gray-600">Order by 2 PM for same-day processing</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Overnight Shipping</h5>
                        <p className="text-gray-600 mb-2">Next business day - $19.99</p>
                        <p className="text-gray-600">Order by 12 PM for next-day delivery</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-lg mb-4 flex items-center">
                      <RotateCcw className="h-5 w-5 text-green-600 mr-2" />
                      Return Policy
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">30-Day Returns</h5>
                        <p className="text-gray-600">Return within 30 days for a full refund</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Free Return Shipping</h5>
                        <p className="text-gray-600">We provide prepaid return labels</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Easy Process</h5>
                        <p className="text-gray-600">Start your return online or contact support</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                  <h4 className="font-medium text-lg mb-4">International Shipping</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Available Countries</h5>
                      <p className="text-gray-700 mb-2">We ship to over 100 countries worldwide</p>
                      <p className="text-gray-600">Shipping costs calculated at checkout</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Delivery Time</h5>
                      <p className="text-gray-700 mb-2">7-14 business days</p>
                      <p className="text-gray-600">Tracking provided for all shipments</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You might also like</h2>
              <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} variant="compact" />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentlyViewed.map((viewedProduct) => (
                <Link 
                  key={viewedProduct.id} 
                  to={`/products/${viewedProduct.id}`}
                  className="group"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={viewedProduct.imageUrl || "https://via.placeholder.com/150"}
                      alt={viewedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 mb-1">
                    {viewedProduct.name}
                  </h3>
                  <p className="text-sm font-bold text-gray-900">
                    ${viewedProduct.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSizeGuide(false)}></div>
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Size Guide</h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Size</th>
                      <th className="text-left py-2">Chest (in)</th>
                      <th className="text-left py-2">Waist (in)</th>
                      <th className="text-left py-2">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'XS', chest: '32-34', waist: '26-28', length: '25' },
                      { size: 'S', chest: '36-38', waist: '28-30', length: '26' },
                      { size: 'M', chest: '40-42', waist: '32-34', length: '27' },
                      { size: 'L', chest: '44-46', waist: '36-38', length: '28' },
                      { size: 'XL', chest: '48-50', waist: '40-42', length: '29' },
                      { size: 'XXL', chest: '52-54', waist: '44-46', length: '30' }
                    ].map((row) => (
                      <tr key={row.size} className="border-b border-gray-100">
                        <td className="py-2 font-medium">{row.size}</td>
                        <td className="py-2">{row.chest}</td>
                        <td className="py-2">{row.waist}</td>
                        <td className="py-2">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;