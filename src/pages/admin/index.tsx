import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  X,
  Camera,
  DollarSign,
  Archive,
  Eye,
  RefreshCw
} from 'lucide-react';
import { getProducts, createProduct, getCategories, updateProduct, deleteProduct } from '../../services/product';
import { Product, Category } from '../../types';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ 
    name: '', 
    price: 0, 
    description: '', 
    quantity: 1, 
    imageUrl: '', 
    category: undefined 
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const filterProducts = () => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category?.id.toString() === selectedCategory
      );
    }
    
    setFilteredProducts(filtered);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.quantity || !newProduct.category) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      await createProduct(newProduct);
      await loadData();
      setNewProduct({ name: '', price: 0, description: '', quantity: 1, imageUrl: '', category: undefined });
      setShowAddForm(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    try {
      setLoading(true);
      await updateProduct(editingProduct.id.toString(), editingProduct);
      await loadData();
      setEditingProduct(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      setLoading(true);
      await deleteProduct(productId.toString());
      await loadData();
      setDeleteConfirm(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewProduct({ name: '', price: 0, description: '', quantity: 1, imageUrl: '', category: undefined });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Camera className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm">No image</span>
            </div>
          </div>
        )}
        
        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.quantity > 10 
              ? 'bg-green-100 text-green-800' 
              : product.quantity > 0 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {product.price.toFixed(2)}
            </span>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Stock</p>
            <p className="font-semibold text-gray-900">{product.quantity}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {product.category?.name || 'No category'}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => setEditingProduct({...product})}
            variant="outline"
            size="sm"
            className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <Button
            onClick={() => setDeleteConfirm(product.id)}
            variant="outline"
            size="sm"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );

  const ProductForm = ({ 
    product, 
    onSubmit, 
    onCancel, 
    title, 
    isEdit = false 
  }: { 
    product: Product | Omit<Product, 'id'>, 
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, 
    onCancel: () => void, 
    title: string,
    isEdit?: boolean 
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onCancel}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={product.name}
                  onChange={e => {
                    if (isEdit) {
                      setEditingProduct({ ...(editingProduct as Product), name: e.target.value });
                    } else {
                      setNewProduct({ ...newProduct, name: e.target.value });
                    }
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={product.price || ''}
                    onChange={e => {
                      if (isEdit) {
                        setEditingProduct({ ...(editingProduct as Product), price: Number(e.target.value) });
                      } else {
                        setNewProduct({ ...newProduct, price: Number(e.target.value) });
                      }
                    }}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                placeholder="Enter product description"
                value={product.description}
                onChange={e => {
                  if (isEdit) {
                    setEditingProduct({ ...(editingProduct as Product), description: e.target.value });
                  } else {
                    setNewProduct({ ...newProduct, description: e.target.value });
                  }
                }}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-vertical"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={product.quantity || ''}
                  onChange={e => {
                    if (isEdit) {
                      setEditingProduct({ ...(editingProduct as Product), quantity: Number(e.target.value) });
                    } else {
                      setNewProduct({ ...newProduct, quantity: Number(e.target.value) });
                    }
                  }}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={product.category?.id || ''}
                  onChange={e => {
                    const cat = categories.find(c => String(c.id) === e.target.value);
                    if (isEdit) {
                      setEditingProduct({ ...(editingProduct as Product), category: cat });
                    } else {
                      setNewProduct({ ...newProduct, category: cat });
                    }
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={product.imageUrl || ''}
                onChange={e => {
                  if (isEdit) {
                    setEditingProduct({ ...(editingProduct as Product), imageUrl: e.target.value });
                  } else {
                    setNewProduct({ ...newProduct, imageUrl: e.target.value });
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isEdit ? 'Update Product' : 'Add Product'}
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const DeleteConfirmModal = ({ productId, onConfirm, onCancel }: {
    productId: number;
    onConfirm: () => void;
    onCancel: () => void;
  }) => {
    const product = products.find(p => p.id === productId);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 rounded-full p-2">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{product?.name}</strong>"? This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <Button
                onClick={onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-purple-100 rounded-full p-2">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <p className="text-gray-600">Manage your product inventory and track performance</p>
            </div>
            
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Products</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>
              <Package className="h-10 w-10 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Categories</p>
                <p className="text-3xl font-bold">{categories.length}</p>
              </div>
              <BarChart3 className="h-10 w-10 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Stock</p>
                <p className="text-3xl font-bold">
                  {products.reduce((sum, p) => sum + p.quantity, 0)}
                </p>
              </div>
              <Archive className="h-10 w-10 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Low Stock Items</p>
                <p className="text-3xl font-bold">
                  {products.filter(p => p.quantity <= 5).length}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Product Inventory ({filteredProducts.length} items)
            </h2>
            
            {filteredProducts.length !== products.length && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                variant="outline"
                size="sm"
              >
                Clear Filters
              </Button>
            )}
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {products.length === 0 ? 'No products yet' : 'No products match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {products.length === 0 
                  ? 'Start by adding your first product!' 
                  : 'Try adjusting your search or filter criteria.'}
              </p>
              {products.length === 0 && (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddForm && (
          <ProductForm
            product={newProduct}
            onSubmit={handleAddProduct}
            onCancel={resetForm}
            title="Add New Product"
            isEdit={false}
          />
        )}

        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSubmit={handleEditProduct}
            onCancel={resetForm}
            title="Edit Product"
            isEdit={true}
          />
        )}

        {deleteConfirm && (
          <DeleteConfirmModal
            productId={deleteConfirm}
            onConfirm={() => handleDeleteProduct(deleteConfirm)}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;