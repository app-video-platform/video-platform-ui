import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addImageToProductAPI,
  IProductResponse,
  createCourseProductAPI,
  createNewProductAPI,
  getAllProductsByUserIdAPI,
  updateCourseDetailsAPI,
  updateProductAPI,
} from '../../api/products-api';
import {
  ICreateProduct,
  INewProductPayload,
  IUpdateCourseDetailsPayload,
  IUpdateProduct,
} from '../../models/product/product';

interface ProductState {
  products: null | IProductResponse[];
  currentProduct: IProductResponse | null; // the product we’re currently creating/editing
  loading: boolean;
  error: string | null;
  // Optional: you might want to store a message (for creating/editing/removing status)
  message: string | null;
}

const initialState: ProductState = {
  products: null,
  currentProduct: null, // the product we’re currently creating/editing
  loading: false,
  error: null,
  message: null,
};

export const createCourseProduct = createAsyncThunk<
  IProductResponse, // what this thunk returns on success
  INewProductPayload, // the argument you pass in
  { rejectValue: string }
>('products/createCourseProduct', async (payload, thunkAPI) => {
  try {
    const response = await createCourseProductAPI(payload);
    return response;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Failed to create product'
    );
  }
});

export const updateCourseProductDetails = createAsyncThunk<
  string, // what this thunk returns on success
  IUpdateCourseDetailsPayload, // the argument you pass in
  { rejectValue: string }
>('products/updateCourseProductDetails', async (payload, thunkAPI) => {
  try {
    const response = await updateCourseDetailsAPI(
      payload.productId,
      payload.details
    );
    return response;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Failed to update product'
    );
  }
});

export const getAllProductsByUserId = createAsyncThunk<
  IProductResponse[], // Return type: Product[]
  string, // Argument type (userId)
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
  IProductResponse, // Return type: Product[]
  ICreateProduct, // Argument type (userId)
  { rejectValue: string } // Error type
>('products/createNewProduct', async (product, { rejectWithValue }) => {
  try {
    const response = await createNewProductAPI(product);
    return response; // API returns user info with token
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Creating Product Failed'
    );
  }
});

export const updateProductDetails = createAsyncThunk<
  IProductResponse, // Return type: Product[]
  IUpdateProduct, // Argument type (userId)
  { rejectValue: string } // Error type
>(
  'products/updateProductDetails',
  async (updatedProduct, { rejectWithValue }) => {
    try {
      const response = await updateProductAPI(updatedProduct);
      return response; // API returns user info with token
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Updating Product Failed'
      );
    }
  }
);

export const addImageToProduct = createAsyncThunk<
  string, // Return type: Product[]
  { productId: string; image: File }, // Argument type (productId)
  { rejectValue: string } // Error type
>(
  'products/addImageToProduct',
  async ({ productId, image }, { rejectWithValue }) => {
    try {
      const response = await addImageToProductAPI(image, productId);
      return response; // API returns user info with token
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Creating Product Failed'
      );
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Set a list of products
    setProducts(state, action: PayloadAction<IProductResponse[]>) {
      state.products = action.payload;
    },
    // Add a single product
    addProduct(state, action: PayloadAction<IProductResponse>) {
      state.products?.push(action.payload);
    },
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.message = null;
      state.error = null;
    },
    // Update an existing product by id
    updateProduct(state, action: PayloadAction<IProductResponse>) {
      const index = state.products?.findIndex(
        (p) => p.id === action.payload.id
      );
      if (state.products && index && index !== -1) {
        state.products[index] = action.payload;
      }
    },
    // Remove a product by id
    removeProduct(state, action: PayloadAction<string>) {
      if (state.products) {
        state.products = state.products.filter((p) => p.id !== action.payload);
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
      // getAllProductsByUserId
      .addCase(getAllProductsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllProductsByUserId.fulfilled,
        (state, action: PayloadAction<IProductResponse[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(getAllProductsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error retrieving products';
      })

      // createNewProduct
      .addCase(createNewProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createNewProduct.fulfilled,
        (state, action: PayloadAction<IProductResponse>) => {
          state.loading = false;
          state.products ??= [];
          state.products.push(action.payload);
        }
      )
      .addCase(createNewProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error creating new product';
      })

      // updateProductDetails
      .addCase(updateProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProductDetails.fulfilled,
        (state, action: PayloadAction<IProductResponse>) => {
          state.loading = false;
          if (state.products) {
            const updatedProduct = action.payload;
            const index = state.products?.findIndex(
              (product) => product.id === updatedProduct.id
            );
            if (index !== -1) {
              state.products[index] = updatedProduct;
            }
          }
        }
      )
      .addCase(updateProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error updating product';
      })
      .addCase(addImageToProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addImageToProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.message = action.payload;
        }
      )
      .addCase(addImageToProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error uploading image';
      })

      .addCase(createCourseProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        createCourseProduct.fulfilled,
        (state, action: PayloadAction<IProductResponse>) => {
          state.loading = false;
          state.error = null;

          state.currentProduct = action.payload;

          state.message = 'Product created successfully';
        }
      )
      .addCase(createCourseProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
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
