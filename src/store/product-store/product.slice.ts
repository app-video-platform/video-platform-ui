import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../models/product/product.types';

interface ProductState {
  products: null | Product[];
  loading: boolean;
  error: string | null;
  // Optional: you might want to store a message (for creating/editing/removing status)
  message: string | null;
}

const initialState: ProductState = {
  products: null,
  loading: false,
  error: null,
  message: null,
};


const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Set a list of products
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    // Add a single product
    addProduct(state, action: PayloadAction<Product>) {
      state.products?.push(action.payload);
    },
    // Update an existing product by id
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products?.findIndex(p => p.id === action.payload.id);
      if (state.products && index && index !== -1) {
        state.products[index] = action.payload;
      }
    },
    // Remove a product by id
    removeProduct(state, action: PayloadAction<string>) {
      if (state.products) {
        state.products = state.products.filter(p => p.id !== action.payload);
      }
    },
    // Set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // Set error state
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;