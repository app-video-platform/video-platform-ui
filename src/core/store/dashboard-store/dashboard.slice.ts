import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CreatorDashboardSummary, RootState } from 'core/api/models';
import { getCreatorDashboardSummaryAPI } from 'core/api/services';
import { extractErrorMessage } from '@shared/utils';

interface DashboardState {
  summary: CreatorDashboardSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  loading: false,
  error: null,
};

export const fetchCreatorDashboardSummary = createAsyncThunk<
  CreatorDashboardSummary,
  void,
  { rejectValue: string }
>('dashboard/fetchCreatorDashboardSummary', async (_, { rejectWithValue }) => {
  try {
    return await getCreatorDashboardSummaryAPI();
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCreatorDashboardSummary.fulfilled,
        (state, action: PayloadAction<CreatorDashboardSummary>) => {
          state.loading = false;
          state.summary = action.payload;
        },
      )
      .addCase(fetchCreatorDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load dashboard';
        state.summary = null;
      });
  },
});

export const selectCreatorDashboardSummary = (state: RootState) =>
  state.dashboard.summary;
export const selectCreatorDashboardLoading = (state: RootState) =>
  state.dashboard.loading;
export const selectCreatorDashboardError = (state: RootState) =>
  state.dashboard.error;

export default dashboardSlice.reducer;
