/* eslint-disable indent */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addImageToProductAPI,
  createCourseProductAPI,
  getAllProductsByUserIdAPI,
  updateCourseDetailsAPI,
  updateSectionDetailsAPI,
  createSectionAPI,
  createLessonAPI,
  updateLessonDetailsAPI,
  deleteLessonAPI,
  deleteSectionAPI,
  deleteProductAPI,
  getProductByProductIdAPI,
} from '../../api/services/products/products-api';
import { ICreateLessonPayload, ILesson } from '../../api/models/product/lesson';
import {
  INewProductPayload,
  IUpdateCourseProduct,
  IUpdateSectionDetails,
  IProductResponse,
  IRemoveProductPayload,
  IRemoveItemPayload,
} from '../../api/models/product/product';
import { ProductType } from '../../api/models/product/product.types';
import { AxiosError } from 'axios';

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

export const extractErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return err.response.data.message;
  } else if (err instanceof Error) {
    return err.message;
  }
  return 'An unknown error occurred';
};

export const createCourseProduct = createAsyncThunk<
  IProductResponse, // what this thunk returns on success
  INewProductPayload, // the argument you pass in
  { rejectValue: string }
>('products/createCourseProduct', async (payload, thunkAPI) => {
  try {
    const response = await createCourseProductAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const updateCourseProductDetails = createAsyncThunk<
  IProductResponse, // what this thunk returns on success
  IUpdateCourseProduct, // the argument you pass in
  { rejectValue: string }
>('products/updateCourseProductDetails', async (payload, thunkAPI) => {
  try {
    const response = await updateCourseDetailsAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const deleteProduct = createAsyncThunk<
  string, // what this thunk returns on success
  IRemoveProductPayload, // the argument you pass in
  { rejectValue: string }
>('products/deleteProduct', async (payload, thunkAPI) => {
  try {
    const response = await deleteProductAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const createSection = createAsyncThunk<
  IUpdateSectionDetails, // what this thunk returns on success
  IUpdateSectionDetails, // the argument you pass in
  { rejectValue: string }
>('products/createSection', async (payload, thunkAPI) => {
  try {
    const response = await createSectionAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const updateSectionDetails = createAsyncThunk<
  string, // what this thunk returns on success
  IUpdateSectionDetails, // the argument you pass in
  { rejectValue: string }
>('products/updateSectionDetails', async (payload, thunkAPI) => {
  try {
    const response = await updateSectionDetailsAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const deleteSection = createAsyncThunk<
  string, // what this thunk returns on success
  IRemoveItemPayload, // the argument you pass in
  { rejectValue: string }
>('products/deleteSection', async (payload, thunkAPI) => {
  try {
    const response = await deleteSectionAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const createLesson = createAsyncThunk<
  ILesson, // what this thunk returns on success
  ICreateLessonPayload, // the argument you pass in
  { rejectValue: string }
>('products/createLesson', async (payload, thunkAPI) => {
  try {
    const response = await createLessonAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const updateLessonDetails = createAsyncThunk<
  string, // what this thunk returns on success
  ILesson, // the argument you pass in
  { rejectValue: string }
>('products/updateLessonDetails', async (payload, thunkAPI) => {
  try {
    const response = await updateLessonDetailsAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const deleteLesson = createAsyncThunk<
  string, // what this thunk returns on success
  IRemoveItemPayload, // the argument you pass in
  { rejectValue: string }
>('products/deleteLesson', async (payload, thunkAPI) => {
  try {
    const response = await deleteLessonAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
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
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

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
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const getProductByProductId = createAsyncThunk<
  IProductResponse, // Return type: Product[]
  { productId: string; productType: ProductType }, // Argument type (productId, productType)
  { rejectValue: string } // Error type
>(
  'products/getProductByProductId',
  async ({ productId, productType }, { rejectWithValue }) => {
    try {
      const response = await getProductByProductIdAPI(productId, productType);
      return response; // API returns user info with token
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
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

    deleteProductFromStore(state, action: PayloadAction<string>) {
      if (state.products) {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      }
      if (state.currentProduct && state.currentProduct.id === action.payload) {
        state.currentProduct = null; // Clear current product if it was deleted
      }
    },

    deleteSectionFromStore(state, action: PayloadAction<string>) {
      if (state.currentProduct) {
        state.currentProduct.sections = state.currentProduct.sections?.filter(
          (section) => section.id !== action.payload
        );
      }
    },

    deleteLessonFromStore(
      state,
      action: PayloadAction<{ sectionId: string; lessonId: string }>
    ) {
      if (state.currentProduct) {
        const section = state.currentProduct.sections?.find(
          (sec) => sec.id === action.payload.sectionId
        );
        if (section && section.lessons) {
          section.lessons = section.lessons.filter(
            (lesson) => lesson.id !== action.payload.lessonId
          );
        }
      }
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
      })

      .addCase(updateCourseProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        updateCourseProductDetails.fulfilled,
        (state, action: PayloadAction<IProductResponse>) => {
          state.loading = false;
          state.error = null;

          state.currentProduct = action.payload;

          state.message = 'Product updated successfully';
        }
      )
      .addCase(updateCourseProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
      })

      .addCase(createSection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        createSection.fulfilled,
        (state, action: PayloadAction<IUpdateSectionDetails>) => {
          state.loading = false;
          state.error = null;

          const updatedSection = action.payload;
          const prod = state.currentProduct;

          if (prod) {
            if (!prod.sections) {
              prod.sections = [updatedSection];
            } else {
              prod.sections.push(updatedSection);
            }
          }

          state.message = 'Section created successfully';
        }
      )
      .addCase(createSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
      })

      .addCase(updateSectionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        updateSectionDetails.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = null;

          state.message = action.payload;
        }
      )
      .addCase(updateSectionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
      })

      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        createLesson.fulfilled,
        (state, action: PayloadAction<ILesson>) => {
          state.loading = false;
          state.error = null;

          const createdLesson = action.payload;
          const section = state.currentProduct?.sections?.find(
            (sec) => sec.id === createdLesson.sectionId
          );
          if (section) {
            // If sections is undefined, initialize it to an array with the new section
            if (!section.lessons) {
              section.lessons = [createdLesson];
            } else {
              section.lessons.push(createdLesson);
            }
          }

          state.message = 'Section created successfully';
        }
      )
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
      })

      .addCase(updateLessonDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        updateLessonDetails.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = null;

          state.message = action.payload;
        }
      )
      .addCase(updateLessonDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
      })

      .addCase(getProductByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        getProductByProductId.fulfilled,
        (state, action: PayloadAction<IProductResponse>) => {
          state.loading = false;
          state.error = null;

          state.currentProduct = action.payload;
        }
      )
      .addCase(getProductByProductId.rejected, (state, action) => {
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
