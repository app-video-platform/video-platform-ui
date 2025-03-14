import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductStatus, ProductType } from '../../models/product/product.types';
import { CeSaZic, createNewProductAPI, getAllProductsByUserIdAPI } from '../../api/products-api';
import { BaseProduct, ICreateProduct } from '../../models/product/product';

interface ProductState {
  products: null | BaseProduct[];
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


export const getAllProductsByUserId = createAsyncThunk<
  BaseProduct[],  // Return type: Product[]
  string,     // Argument type (userId)
  { rejectValue: string } // Error type
>('products/getAllProductsByUserId', async (idToken, { rejectWithValue }) => {
  try {
    const response = await getAllProductsByUserIdAPI(idToken);
    return response; // API returns user info with token
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Signin failed');
  }
});

export const createNewProduct = createAsyncThunk<
  CeSaZic,  // Return type: Product[]
  ICreateProduct,     // Argument type (userId)
  { rejectValue: string } // Error type
>('products/createNewProduct', async (product, { rejectWithValue }) => {
  try {
    const response = await createNewProductAPI(product);
    return response; // API returns user info with token
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Creating Product Failed');
  }
});


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

  extraReducers: (builder) => {
    builder
      .addCase(getAllProductsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductsByUserId.fulfilled, (state, action: PayloadAction<BaseProduct[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProductsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error retrieving products';
      })
      .addCase(createNewProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewProduct.fulfilled, (state, action: PayloadAction<CeSaZic>) => {
        state.loading = false;
        state.products ??= [];
        const now = new Date(Date.now());
        state.products?.push({
          createdAt: now,
          customers: 0,
          description: action.payload.description,
          id: action.payload.id,
          image: '',
          name: action.payload.name,
          price: action.payload.price,
          status: action.payload.status as ProductStatus,
          type: action.payload.type as ProductType,
          updatedAt: now,
          userId: action.payload.userId
        });
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error creating new product';
      });
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