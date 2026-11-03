import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ProductLandingPageConfig,
  ProductLandingPageConfigUpdateRequest,
} from 'core/api/models';
import {
  getCreatorProductLandingPageConfigAPI,
  getPublicProductLandingPageConfigAPI,
  updateCreatorProductLandingPageConfigAPI,
} from 'core/api/services';
import { extractErrorMessage } from '@shared/utils';
import { isAxiosError } from 'axios';

interface ProductLandingPageState {
  publicByProductId: Record<string, ProductLandingPageConfig>;
  publicLoading: boolean;
  publicError: string | null;
  creatorByProductId: Record<string, ProductLandingPageConfig>;
  creatorLoading: boolean;
  creatorError: string | null;
  creatorSaveLoading: boolean;
  creatorSaveError: string | null;
  creatorSaveRequestId?: string;
}

const initialState: ProductLandingPageState = {
  publicByProductId: {},
  publicLoading: false,
  publicError: null,
  creatorByProductId: {},
  creatorLoading: false,
  creatorError: null,
  creatorSaveLoading: false,
  creatorSaveError: null,
};

export const fetchPublicProductLandingPageConfig = createAsyncThunk<
  ProductLandingPageConfig,
  string,
  { rejectValue: string }
>(
  'productLandingPage/fetchPublicProductLandingPageConfig',
  async (productId, { rejectWithValue }) => {
    try {
      return await getPublicProductLandingPageConfigAPI(productId);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const fetchCreatorProductLandingPageConfig = createAsyncThunk<
  ProductLandingPageConfig,
  string,
  { rejectValue: string }
>(
  'productLandingPage/fetchCreatorProductLandingPageConfig',
  async (productId, { rejectWithValue }) => {
    try {
      return await getCreatorProductLandingPageConfigAPI(productId);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const updateCreatorProductLandingPageConfig = createAsyncThunk<
  ProductLandingPageConfig,
  {
    productId: string;
    config: ProductLandingPageConfigUpdateRequest;
  },
  { rejectValue: string }
>(
  'productLandingPage/updateCreatorProductLandingPageConfig',
  async ({ productId, config }, { rejectWithValue }) => {
    try {
      return await updateCreatorProductLandingPageConfigAPI(productId, config);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 403) {
          return rejectWithValue('You do not have permission to save this landing page.');
        }
        if (error.response?.status === 404) {
          return rejectWithValue('This landing page is unavailable.');
        }
        return rejectWithValue('Could not save the landing page. Please try again.');
      }
      return rejectWithValue('Could not save the landing page. Please try again.');
    }
  },
);

const productLandingPageSlice = createSlice({
  name: 'productLandingPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicProductLandingPageConfig.pending, (state) => {
        state.publicLoading = true;
        state.publicError = null;
      })
      .addCase(
        fetchPublicProductLandingPageConfig.fulfilled,
        (state, action: PayloadAction<ProductLandingPageConfig>) => {
          state.publicLoading = false;
          state.publicByProductId[action.payload.productId] = action.payload;
        },
      )
      .addCase(fetchPublicProductLandingPageConfig.rejected, (state, action) => {
        state.publicLoading = false;
        state.publicError =
          action.payload ?? 'Failed to load Product Landing Page configuration';
      })
      .addCase(fetchCreatorProductLandingPageConfig.pending, (state) => {
        state.creatorLoading = true;
        state.creatorError = null;
      })
      .addCase(
        fetchCreatorProductLandingPageConfig.fulfilled,
        (state, action: PayloadAction<ProductLandingPageConfig>) => {
          state.creatorLoading = false;
          state.creatorByProductId[action.payload.productId] = action.payload;
        },
      )
      .addCase(fetchCreatorProductLandingPageConfig.rejected, (state, action) => {
        state.creatorLoading = false;
        state.creatorError =
          action.payload ?? 'Failed to load Product Landing Page configuration';
      })
      .addCase(updateCreatorProductLandingPageConfig.pending, (state, action) => {
        state.creatorSaveRequestId = action.meta.requestId;
        state.creatorSaveLoading = true;
        state.creatorSaveError = null;
      })
      .addCase(
        updateCreatorProductLandingPageConfig.fulfilled,
        (state, action) => {
          if (action.meta?.requestId) {
            if (state.creatorSaveRequestId !== action.meta.requestId) {return;}
            state.creatorSaveRequestId = undefined;
            state.creatorSaveLoading = false;
            state.creatorSaveError = null;
          }
          state.creatorByProductId[action.payload.productId] = action.payload;
          state.publicByProductId[action.payload.productId] = action.payload;
        },
      )
      .addCase(updateCreatorProductLandingPageConfig.rejected, (state, action) => {
        if (state.creatorSaveRequestId !== action.meta.requestId) {
          return;
        }
        state.creatorSaveRequestId = undefined;
        state.creatorSaveLoading = false;
        state.creatorSaveError =
          action.payload ?? 'Failed to save Product Landing Page configuration';
      });
  },
});

export default productLandingPageSlice.reducer;
