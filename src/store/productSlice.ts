import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';
import * as productService from '../services/product';

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getProducts();
    } catch (error: any) {
      // Improved error handling
      console.error('fetchProducts thunk error:', error);
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await productService.getProductById(id);
    } catch (error: any) {
      // Improved error handling
      console.error(`fetchProductById thunk error for id ${id}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      return await productService.searchProducts(searchTerm);
    } catch (error: any) {
      // Improved error handling
      console.error(`searchProducts thunk error for term ${searchTerm}:`, error);
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('fetchProducts pending');
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
        console.log(`fetchProducts fulfilled with ${action.payload.length} products`);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch products';
        console.error('fetchProducts rejected:', action.payload);
      })
      
      // Fetch product by id
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('fetchProductById pending');
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
        console.log('fetchProductById fulfilled:', action.payload.id);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch product';
        console.error('fetchProductById rejected:', action.payload);
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('searchProducts pending');
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
        console.log(`searchProducts fulfilled with ${action.payload.length} results`);
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Search failed';
        console.error('searchProducts rejected:', action.payload);
      });
  },
});

export const { clearProductError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;