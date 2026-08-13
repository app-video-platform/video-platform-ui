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

interface ProductLandingPageState {
  publicByProductId: Record<string, ProductLandingPageConfig>;
  publicLoading: boolean;
  publicError: string | null;
  creatorByProductId: Record<string, ProductLandingPageConfig>;
  creatorLoading: boolean;
  creatorError: string | null;
  creatorSaveLoading: boolean;
  creatorSaveError: string | null;
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
      return rejectWithValue(extractErrorMessage(error));
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
      .addCase(updateCreatorProductLandingPageConfig.pending, (state) => {
        state.creatorSaveLoading = true;
        state.creatorSaveError = null;
      })
      .addCase(
        updateCreatorProductLandingPageConfig.fulfilled,
        (state, action: PayloadAction<ProductLandingPageConfig>) => {
          state.creatorSaveLoading = false;
          state.creatorByProductId[action.payload.productId] = action.payload;
          state.publicByProductId[action.payload.productId] = action.payload;
        },
      )
      .addCase(updateCreatorProductLandingPageConfig.rejected, (state, action) => {
        state.creatorSaveLoading = false;
        state.creatorSaveError =
          action.payload ?? 'Failed to save Product Landing Page configuration';
      });
  },
});

export default productLandingPageSlice.reducer;
