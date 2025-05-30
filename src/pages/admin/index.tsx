import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, getCategories, updateProduct, deleteProduct } from '../../services/product';
import { Product, Category } from '../../types';

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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

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
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await deleteProduct(productId.toString());
        await loadData();
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div style={{
      border: '1px solid #e1e5e9',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      ':hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }
    }}>
      <div style={{ marginBottom: '16px' }}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d',
            fontSize: '14px'
          }}>
            No image
          </div>
        )}
      </div>
      
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
        {product.name}
      </h3>
      
      <p style={{ margin: '0 0 8px 0', color: '#6c757d', fontSize: '14px' }}>
        {product.description}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#27ae60' }}>
          ${product.price}
        </span>
        <span style={{ fontSize: '14px', color: '#6c757d' }}>
          Stock: {product.quantity}
        </span>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <span style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {product.category?.name || 'No category'}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setEditingProduct({...product})}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#e67e22'}
          onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#f39c12'}
        >
          ✏️ Edit
        </button>
        
        <button
          onClick={() => handleDeleteProduct(product.id)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#c0392b'}
          onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#e74c3c'}
        >
          🗑️ Delete
        </button>
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginTop: 0, color: '#2c3e50' }}>{title}</h2>
        
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '16px' }}>
          <input
            placeholder="Product Name"
            value={product.name}
            onChange={e => {
              if (isEdit) {
                setEditingProduct({ ...(editingProduct as Product), name: e.target.value });
              } else {
                setNewProduct({ ...newProduct, name: e.target.value });
              }
            }}
            required
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          
          <input
            placeholder="Price"
            type="number"
            step="0.01"
            value={product.price}
            onChange={e => {
              if (isEdit) {
                setEditingProduct({ ...(editingProduct as Product), price: Number(e.target.value) });
              } else {
                setNewProduct({ ...newProduct, price: Number(e.target.value) });
              }
            }}
            required
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          
          <textarea
            placeholder="Description"
            value={product.description}
            onChange={e => {
              if (isEdit) {
                setEditingProduct({ ...(editingProduct as Product), description: e.target.value });
              } else {
                setNewProduct({ ...newProduct, description: e.target.value });
              }
            }}
            required
            rows={3}
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          
          <input
            placeholder="Quantity"
            type="number"
            value={product.quantity}
            onChange={e => {
              if (isEdit) {
                setEditingProduct({ ...(editingProduct as Product), quantity: Number(e.target.value) });
              } else {
                setNewProduct({ ...newProduct, quantity: Number(e.target.value) });
              }
            }}
            required
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          
          <input
            placeholder="Image URL (optional)"
            value={product.imageUrl || ''}
            onChange={e => {
              if (isEdit) {
                setEditingProduct({ ...(editingProduct as Product), imageUrl: e.target.value });
              } else {
                setNewProduct({ ...newProduct, imageUrl: e.target.value });
              }
            }}
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          
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
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Add Product')}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#6c757d'
      }}>
        Loading products...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '3px solid #3498db'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', color: '#2c3e50' }}>
            🛡️ Admin Dashboard
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
            Manage your product inventory
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: '14px 28px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#3498db'}
        >
          ➕ Add New Product
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#3498db',
          color: 'white',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '32px' }}>{products.length}</h3>
          <p style={{ margin: '4px 0 0 0' }}>Total Products</p>
        </div>
        
        <div style={{
          padding: '20px',
          backgroundColor: '#27ae60',
          color: 'white',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '32px' }}>{categories.length}</h3>
          <p style={{ margin: '4px 0 0 0' }}>Categories</p>
        </div>
        
        <div style={{
          padding: '20px',
          backgroundColor: '#f39c12',
          color: 'white',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '32px' }}>
            {products.reduce((sum, p) => sum + p.quantity, 0)}
          </h3>
          <p style={{ margin: '4px 0 0 0' }}>Total Stock</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '16px',
          backgroundColor: '#e74c3c',
          color: 'white',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Products Grid */}
      <div>
        <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>
          📦 Product Inventory ({products.length} items)
        </h2>
        
        {products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 20px',
            color: '#6c757d'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3>No products yet</h3>
            <p>Start by adding your first product!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <ProductForm
          product={newProduct}
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
          title="Add New Product"
          isEdit={false}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleEditProduct}
          onCancel={() => setEditingProduct(null)}
          title="Edit Product"
          isEdit={true}
        />
      )}
    </div>
  );
};

export default AdminDashboard;