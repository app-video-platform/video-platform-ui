import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  CreatorStorefrontConfig,
  CreatorStorefrontConfigUpdateRequest,
  PublicStorefront,
  RootState,
} from 'core/api/models';
import {
  getCreatorStorefrontConfigAPI,
  getPublicStorefrontAPI,
  updateCreatorStorefrontConfigAPI,
} from 'core/api/services';
import { extractErrorMessage } from '@shared/utils';

interface StorefrontState {
  publicByCreatorId: Record<string, PublicStorefront>;
  publicLoading: boolean;
  publicError: string | null;
  creatorConfig: CreatorStorefrontConfig | null;
  configLoading: boolean;
  configError: string | null;
  configSaveLoading: boolean;
  configSaveError: string | null;
}

const initialState: StorefrontState = {
  publicByCreatorId: {},
  publicLoading: false,
  publicError: null,
  creatorConfig: null,
  configLoading: false,
  configError: null,
  configSaveLoading: false,
  configSaveError: null,
};

export const fetchPublicStorefront = createAsyncThunk<
  PublicStorefront,
  string,
  { rejectValue: string }
>('storefront/fetchPublicStorefront', async (creatorId, { rejectWithValue }) => {
  try {
    return await getPublicStorefrontAPI(creatorId);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchCreatorStorefrontConfig = createAsyncThunk<
  CreatorStorefrontConfig,
  void,
  { rejectValue: string }
>('storefront/fetchCreatorStorefrontConfig', async (_, { rejectWithValue }) => {
  try {
    return await getCreatorStorefrontConfigAPI();
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateCreatorStorefrontConfig = createAsyncThunk<
  CreatorStorefrontConfig,
  CreatorStorefrontConfigUpdateRequest,
  { rejectValue: string }
>(
  'storefront/updateCreatorStorefrontConfig',
  async (payload, { rejectWithValue }) => {
    try {
      return await updateCreatorStorefrontConfigAPI(payload);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

const storefrontSlice = createSlice({
  name: 'storefront',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicStorefront.pending, (state) => {
        state.publicLoading = true;
        state.publicError = null;
      })
      .addCase(
        fetchPublicStorefront.fulfilled,
        (state, action: PayloadAction<PublicStorefront>) => {
          state.publicLoading = false;
          state.publicByCreatorId[action.payload.creator.id] = action.payload;
        },
      )
      .addCase(fetchPublicStorefront.rejected, (state, action) => {
        state.publicLoading = false;
        state.publicError = action.payload ?? 'Failed to load Storefront';
      })
      .addCase(fetchCreatorStorefrontConfig.pending, (state) => {
        state.configLoading = true;
        state.configError = null;
      })
      .addCase(
        fetchCreatorStorefrontConfig.fulfilled,
        (state, action: PayloadAction<CreatorStorefrontConfig>) => {
          state.configLoading = false;
          state.creatorConfig = action.payload;
        },
      )
      .addCase(fetchCreatorStorefrontConfig.rejected, (state, action) => {
        state.configLoading = false;
        state.configError =
          action.payload ?? 'Failed to load Storefront configuration';
        state.creatorConfig = null;
      })
      .addCase(updateCreatorStorefrontConfig.pending, (state) => {
        state.configSaveLoading = true;
        state.configSaveError = null;
      })
      .addCase(
        updateCreatorStorefrontConfig.fulfilled,
        (state, action: PayloadAction<CreatorStorefrontConfig>) => {
          state.configSaveLoading = false;
          state.creatorConfig = action.payload;
        },
      )
      .addCase(updateCreatorStorefrontConfig.rejected, (state, action) => {
        state.configSaveLoading = false;
        state.configSaveError =
          action.payload ?? 'Failed to save Storefront configuration';
      });
  },
});

export const selectPublicStorefrontByCreatorId = (
  state: RootState,
  creatorId?: string,
) => (creatorId ? state.storefront.publicByCreatorId[creatorId] ?? null : null);
export const selectPublicStorefrontLoading = (state: RootState) =>
  state.storefront.publicLoading;
export const selectPublicStorefrontError = (state: RootState) =>
  state.storefront.publicError;
export const selectCreatorStorefrontConfig = (state: RootState) =>
  state.storefront.creatorConfig;
export const selectCreatorStorefrontConfigLoading = (state: RootState) =>
  state.storefront.configLoading;
export const selectCreatorStorefrontConfigError = (state: RootState) =>
  state.storefront.configError;
export const selectCreatorStorefrontConfigSaveLoading = (state: RootState) =>
  state.storefront.configSaveLoading;
export const selectCreatorStorefrontConfigSaveError = (state: RootState) =>
  state.storefront.configSaveError;

export default storefrontSlice.reducer;
