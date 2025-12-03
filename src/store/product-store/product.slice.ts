/* eslint-disable indent */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  IRemoveProductPayload,
  CourseProductSection,
  CourseSectionCreateRequest,
  CourseSectionUpdateRequest,
  IRemoveItemPayload,
  CourseLesson,
  LessonCreate,
  AbstractProductBase,
} from '@api/models';
import {
  createProductAPI,
  updateProductDetailsAPI,
  deleteProductAPI,
  createSectionAPI,
  updateSectionDetailsAPI,
  deleteSectionAPI,
  createLessonAPI,
  updateLessonDetailsAPI,
  deleteLessonAPI,
  getAllProductsByUserIdAPI,
  addImageToProductAPI,
  getProductByProductIdAPI,
} from '@api/services';
import { AbstractProduct, CreateProductPayload, ProductType } from '@api/types';
import { extractErrorMessage } from '@shared/utils';

interface ProductState {
  products: null | AbstractProduct[];
  currentProduct: AbstractProduct | null; // the product we’re currently creating/editing
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: null,
  currentProduct: null, // the product we’re currently creating/editing
  loading: false,
  error: null,
};

export const createCourseProduct = createAsyncThunk<
  AbstractProduct, // what this thunk returns on success
  CreateProductPayload, // the argument you pass in
  { rejectValue: string }
>('products/createCourseProduct', async (payload, thunkAPI) => {
  try {
    const response = await createProductAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const updateCourseProductDetails = createAsyncThunk<
  AbstractProduct, // what this thunk returns on success
  AbstractProductBase, // the argument you pass in
  { rejectValue: string }
>('products/updateCourseProductDetails', async (payload, thunkAPI) => {
  try {
    const response = await updateProductDetailsAPI(payload);
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
    const response: string = await deleteProductAPI(payload);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const createSection = createAsyncThunk<
  CourseProductSection, // what this thunk returns on success
  CourseSectionCreateRequest, // the argument you pass in
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
  CourseSectionUpdateRequest, // the argument you pass in
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
  CourseLesson, // what this thunk returns on success
  LessonCreate, // the argument you pass in
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
  CourseLesson, // the argument you pass in
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
  AbstractProduct[], // Return type: Product[]
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
      const res = await addImageToProductAPI(image, productId);
      return res; // API returns user info with token
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const getProductByProductId = createAsyncThunk<
  AbstractProduct, // Return type: Product[]
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
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.error = null;
    },

    deleteProductFromStore(state, action: PayloadAction<string>) {
      if (state.products) {
        state.products = state.products.filter(
          (product) => product.id !== action.payload,
        );
      }
      if (state.currentProduct && state.currentProduct.id === action.payload) {
        state.currentProduct = null; // Clear current product if it was deleted
      }
    },

    deleteSectionFromStore(state, action: PayloadAction<string>) {
      // if (
      //   state.currentProduct &&
      //   state.currentProduct.type !== 'CONSULTATION' &&
      //   state.currentProduct.sections &&
      //   state.currentProduct.sections.length > 0
      // ) {
      //   state.currentProduct.sections = state.currentProduct.sections.filter(
      //     (section) => section.id !== action.payload,
      //   );
      // }
    },

    deleteLessonFromStore(
      state,
      action: PayloadAction<{ sectionId: string; lessonId: string }>,
    ) {
      if (state.currentProduct?.type !== 'COURSE') {
        return;
      }
      if (state.currentProduct) {
        const section = state.currentProduct.sections?.find(
          (sec) => sec.id === action.payload.sectionId,
        );
        if (section && section.lessons) {
          section.lessons = section.lessons.filter(
            (lesson) => lesson.id !== action.payload.lessonId,
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
        (state, action: PayloadAction<AbstractProduct[]>) => {
          state.loading = false;
          state.products = action.payload;
        },
      )
      .addCase(getAllProductsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error retrieving products';
      })

      .addCase(addImageToProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImageToProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error uploading image';
      })

      .addCase(createCourseProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCourseProduct.fulfilled,
        (state, action: PayloadAction<AbstractProduct>) => {
          state.loading = false;
          state.error = null;

          state.currentProduct = action.payload;
        },
      )
      .addCase(createCourseProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateCourseProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCourseProductDetails.fulfilled,
        (state, action: PayloadAction<AbstractProduct>) => {
          state.loading = false;
          state.error = null;

          state.currentProduct = action.payload;
        },
      )
      .addCase(updateCourseProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createSection.fulfilled,
        (state, action: PayloadAction<CourseProductSection>) => {
          state.loading = false;
          state.error = null;

          const updatedSection = action.payload;
          const prod = state.currentProduct;

          if (prod && prod.type !== 'CONSULTATION') {
            if (!prod.sections) {
              prod.sections = [updatedSection];
            } else {
              prod.sections.push(updatedSection);
            }
          }
        },
      )
      .addCase(createSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateSectionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSectionDetails.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateSectionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createLesson.fulfilled,
        (state, action: PayloadAction<CourseLesson>) => {
          state.loading = false;
          state.error = null;
          if (state.currentProduct?.type !== 'COURSE') {
            return;
          }
          const createdLesson = action.payload;
          const section = state.currentProduct?.sections?.find(
            (sec: { id?: string }) => sec.id === createdLesson.sectionId,
          );
          if (section) {
            // If sections is undefined, initialize it to an array with the new section
            if (!section.lessons) {
              section.lessons = [createdLesson];
            } else {
              section.lessons.push(createdLesson);
            }
          }
        },
      )
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateLessonDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLessonDetails.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateLessonDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getProductByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProductByProductId.fulfilled,
        (state, action: PayloadAction<AbstractProduct>) => {
          state.loading = false;
          state.error = null;
          state.currentProduct = action.payload;
        },
      )
      .addCase(getProductByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;
