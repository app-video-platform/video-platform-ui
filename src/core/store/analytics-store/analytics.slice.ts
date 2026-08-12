import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  CreatorAnalyticsOverview,
  CreatorAnalyticsOverviewQuery,
  RootState,
} from 'core/api/models';
import { getCreatorAnalyticsOverviewAPI } from 'core/api/services';
import { extractErrorMessage } from '@shared/utils';

interface AnalyticsState {
  overview: CreatorAnalyticsOverview | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  overview: null,
  loading: false,
  error: null,
};

export const fetchCreatorAnalyticsOverview = createAsyncThunk<
  CreatorAnalyticsOverview,
  CreatorAnalyticsOverviewQuery | undefined,
  { rejectValue: string }
>('analytics/fetchCreatorAnalyticsOverview', async (query, { rejectWithValue }) => {
  try {
    return await getCreatorAnalyticsOverviewAPI(query);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorAnalyticsOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCreatorAnalyticsOverview.fulfilled,
        (state, action: PayloadAction<CreatorAnalyticsOverview>) => {
          state.loading = false;
          state.overview = action.payload;
        },
      )
      .addCase(fetchCreatorAnalyticsOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load analytics';
        state.overview = null;
      });
  },
});

export const selectAnalyticsOverview = (state: RootState) =>
  state.analytics.overview;
export const selectAnalyticsLoading = (state: RootState) =>
  state.analytics.loading;
export const selectAnalyticsError = (state: RootState) =>
  state.analytics.error;

export default analyticsSlice.reducer;
