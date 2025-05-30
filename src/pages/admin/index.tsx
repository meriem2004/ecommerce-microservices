import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, getCategories } from '../../services/product';
import ProductList from '../../components/products/ProductList';
import { Product, Category } from '../../types';
import useAuth from '../../hooks/useAuth';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ 
    name: '', 
    price: 0, 
    description: '', 
    quantity: 1, 
    imageUrl: '', 
    category: undefined 
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, user, getAuthToken } = useAuth();

  useEffect(() => {
    console.log('AdminDashboard mounted - Auth state:', {
      isAuthenticated,
      user: user?.email,
      hasToken: !!getAuthToken()
    });
    
    setLoading(true);
    setError(null);
    Promise.all([getProducts(), getCategories()])
      .then(([products, categories]) => {
        setProducts(products);
        setCategories(categories);
      })
      .catch((err) => {
        console.error('Error loading initial data:', err);
        setError(err.message || 'Failed to fetch products/categories');
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, getAuthToken]);

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check authentication before proceeding
    if (!isAuthenticated) {
      setError('You must be logged in to add products');
      return;
    }
    
    const token = getAuthToken();
    if (!token) {
      setError('No authentication token found. Please log in again.');
      return;
    }
    
    console.log('Adding product - Auth check passed:', {
      isAuthenticated,
      hasToken: !!token,
      user: user?.email,
      tokenPreview: token.substring(0, 20) + '...'
    });
    
    setLoading(true);
    setError(null);
    
    // Validate required fields
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.quantity || !newProduct.category) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Creating product with data:', newProduct);
      const createdProduct = await createProduct(newProduct);
      console.log('Product created successfully:', createdProduct);
      
      // Refresh products list
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      
      // Reset form
      setNewProduct({ 
        name: '', 
        price: 0, 
        description: '', 
        quantity: 1, 
        imageUrl: '', 
        category: undefined 
      });
      
      console.log('Product added successfully and form reset');
    } catch (err: any) {
      console.error('Error adding product:', err);
      
      // Handle specific error types
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to add products.');
      } else if (err.message?.includes('CORS')) {
        setError('Server connection error. Please try again.');
      } else {
        setError(err.message || 'Failed to add product');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (loading && products.length === 0) {
    return <div>Loading...</div>;
  }

  // Show auth warning if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <div style={{ color: 'red', padding: '20px', border: '1px solid red', borderRadius: '5px' }}>
          You must be logged in as an admin to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* Auth Info Debug Panel */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '10px', 
        borderRadius: '5px', 
        marginBottom: '20px',
        fontSize: '12px'
      }}>
        <strong>Auth Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'} | 
        <strong> User:</strong> {user?.email || 'None'} | 
        <strong> Token:</strong> {getAuthToken() ? '✅ Present' : '❌ Missing'}
      </div>
      
      <form onSubmit={handleAddProduct} style={{ marginBottom: 24, display: 'grid', gap: 12, maxWidth: 500 }}>
        <input
          placeholder="Name"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          required
          disabled={loading}
        />
        <input
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          required
          disabled={loading}
        />
        <input
          placeholder="Description"
          value={newProduct.description}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          required
          disabled={loading}
        />
        <input
          placeholder="Quantity"
          type="number"
          value={newProduct.quantity}
          onChange={e => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
          required
          disabled={loading}
        />
        <input
          placeholder="Image URL (optional)"
          value={newProduct.imageUrl || ''}
          onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
          disabled={loading}
        />
        <select
          value={newProduct.category?.id || ''}
          onChange={e => {
            const cat = categories.find(c => String(c.id) === e.target.value);
            setNewProduct({ ...newProduct, category: cat });
          }}
          required
          disabled={loading}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" disabled={loading || !isAuthenticated}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
      
      <h2>All Products</h2>
      {error && <div style={{ color: 'red', marginBottom: 16, padding: '10px', border: '1px solid red', borderRadius: '5px' }}>
        <strong>Error:</strong> {error}
      </div>}
      <ProductList products={products} loading={loading} />
    </div>
  );
};

export default AdminDashboard;