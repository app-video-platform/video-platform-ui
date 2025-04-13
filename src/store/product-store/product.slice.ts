import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductStatus, ProductType } from '../../models/product/product.types';
import { addImageToProductAPI, CeSaZic, createNewProductAPI, getAllProductsByUserIdAPI, updateProductAPI } from '../../api/products-api';
import { BaseProduct, ICreateProduct, IUpdateProduct } from '../../models/product/product';
import { AppDispatch } from '../store';
import { addNotification } from '../auth-store/auth.slice';
import { useSelector } from 'react-redux';
import { selectNotifications } from '../auth-store/auth.selectors';

interface ProductState {
  products: null | CeSaZic[];
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
  CeSaZic[],  // Return type: Product[]
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
  { rejectValue: string, dispatch: AppDispatch } // Error type
>('products/createNewProduct', async (product, { rejectWithValue, dispatch }) => {
  const notifications = useSelector(selectNotifications);

  try {
    const response = await createNewProductAPI(product);
    dispatch(addNotification({
      id: notifications.length + 1,
      isRead: false,
      type: 'SUCCESS',
      title: 'Product Created',
      message: `Your product ${product.name} was created successfully. You can go to your products dashboard and check it out.`
    }));
    return response; // API returns user info with token
  } catch (error: any) {
    dispatch(addNotification({
      id: notifications.length + 1,
      isRead: false,
      type: 'ERROR',
      title: 'Product Creation Faile',
      message: `Your product ${product.name} could not be created. Sorry :(`
    }));
    return rejectWithValue(error.response?.data?.message || 'Creating Product Failed');
  }
});

export const updateProductDetails = createAsyncThunk<
  CeSaZic,  // Return type: Product[]
  IUpdateProduct,     // Argument type (userId)
  { rejectValue: string } // Error type
>('products/updateProductDetails', async (updatedProduct, { rejectWithValue }) => {
  try {
    const response = await updateProductAPI(updatedProduct);
    return response; // API returns user info with token
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Updating Product Failed');
  }
});

export const addImageToProduct = createAsyncThunk<
  string,  // Return type: Product[]
  { productId: string; image: File },     // Argument type (productId)
  { rejectValue: string } // Error type
>('products/addImageToProduct', async ({ productId, image }, { rejectWithValue }) => {
  try {
    const response = await addImageToProductAPI(image, productId);
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
    setProducts(state, action: PayloadAction<CeSaZic[]>) {
      state.products = action.payload;
    },
    // Add a single product
    addProduct(state, action: PayloadAction<CeSaZic>) {
      state.products?.push(action.payload);
    },
    // Update an existing product by id
    updateProduct(state, action: PayloadAction<CeSaZic>) {
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
      // getAllProductsByUserId
      .addCase(getAllProductsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductsByUserId.fulfilled, (state, action: PayloadAction<CeSaZic[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProductsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error retrieving products';
      })

      // createNewProduct
      .addCase(createNewProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewProduct.fulfilled, (state, action: PayloadAction<CeSaZic>) => {
        state.loading = false;
        state.products ??= [];
        state.products.push(action.payload);
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error creating new product';
      })

      // updateProductDetails
      .addCase(updateProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductDetails.fulfilled, (state, action: PayloadAction<CeSaZic>) => {
        state.loading = false;
        if (state.products) {
          const updatedProduct = action.payload;
          const index = state.products?.findIndex(product => product.id === updatedProduct.id);
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
        }
      })
      .addCase(updateProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error updating product';
      })
      .addCase(addImageToProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImageToProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(addImageToProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error uploading image';
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