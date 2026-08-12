import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  CreatorOrdersPage,
  CreatorOrdersQuery,
  CreatorSalesSummary,
  CreatorSalesSummaryQuery,
  RootState,
  SalesOrderDetail,
} from 'core/api/models';
import {
  getCreatorOrderDetailAPI,
  getCreatorOrdersPageAPI,
  getCreatorSalesSummaryAPI,
} from 'core/api/services';
import { extractErrorMessage } from '@shared/utils';

interface SalesState {
  summary: CreatorSalesSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;
  ordersPage: CreatorOrdersPage | null;
  ordersLoading: boolean;
  ordersError: string | null;
  currentOrder: SalesOrderDetail | null;
  detailLoading: boolean;
  detailError: string | null;
}

const initialState: SalesState = {
  summary: null,
  summaryLoading: false,
  summaryError: null,
  ordersPage: null,
  ordersLoading: false,
  ordersError: null,
  currentOrder: null,
  detailLoading: false,
  detailError: null,
};

const EMPTY_ORDERS: CreatorOrdersPage['content'] = [];
const EMPTY_ORDER_PRODUCT_OPTIONS: CreatorOrdersPage['productOptions'] = [];

export const fetchCreatorSalesSummary = createAsyncThunk<
  CreatorSalesSummary,
  CreatorSalesSummaryQuery | undefined,
  { rejectValue: string }
>('sales/fetchCreatorSalesSummary', async (query, { rejectWithValue }) => {
  try {
    return await getCreatorSalesSummaryAPI(query);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchCreatorOrdersPage = createAsyncThunk<
  CreatorOrdersPage,
  CreatorOrdersQuery | undefined,
  { rejectValue: string }
>('sales/fetchCreatorOrdersPage', async (query, { rejectWithValue }) => {
  try {
    return await getCreatorOrdersPageAPI(query);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchCreatorOrderDetail = createAsyncThunk<
  SalesOrderDetail,
  string,
  { rejectValue: string }
>('sales/fetchCreatorOrderDetail', async (orderId, { rejectWithValue }) => {
  try {
    return await getCreatorOrderDetailAPI(orderId);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorSalesSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(
        fetchCreatorSalesSummary.fulfilled,
        (state, action: PayloadAction<CreatorSalesSummary>) => {
          state.summaryLoading = false;
          state.summary = action.payload;
        },
      )
      .addCase(fetchCreatorSalesSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload ?? 'Failed to load sales summary';
        state.summary = null;
      })
      .addCase(fetchCreatorOrdersPage.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(
        fetchCreatorOrdersPage.fulfilled,
        (state, action: PayloadAction<CreatorOrdersPage>) => {
          state.ordersLoading = false;
          state.ordersPage = action.payload;
        },
      )
      .addCase(fetchCreatorOrdersPage.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload ?? 'Failed to load orders';
        state.ordersPage = null;
      })
      .addCase(fetchCreatorOrderDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(
        fetchCreatorOrderDetail.fulfilled,
        (state, action: PayloadAction<SalesOrderDetail>) => {
          state.detailLoading = false;
          state.currentOrder = action.payload;
        },
      )
      .addCase(fetchCreatorOrderDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload ?? 'Failed to load order';
        state.currentOrder = null;
      });
  },
});

export const { clearCurrentOrder } = salesSlice.actions;

export const selectCreatorSalesSummary = (state: RootState) =>
  state.sales.summary;
export const selectCreatorSalesSummaryLoading = (state: RootState) =>
  state.sales.summaryLoading;
export const selectCreatorSalesSummaryError = (state: RootState) =>
  state.sales.summaryError;
export const selectCreatorOrdersPage = (state: RootState) =>
  state.sales.ordersPage;
export const selectCreatorOrders = (state: RootState) =>
  state.sales.ordersPage?.content ?? EMPTY_ORDERS;
export const selectCreatorOrderProductOptions = (state: RootState) =>
  state.sales.ordersPage?.productOptions ?? EMPTY_ORDER_PRODUCT_OPTIONS;
export const selectCreatorOrdersLoading = (state: RootState) =>
  state.sales.ordersLoading;
export const selectCreatorOrdersError = (state: RootState) =>
  state.sales.ordersError;
export const selectCurrentCreatorOrder = (state: RootState) =>
  state.sales.currentOrder;
export const selectCreatorOrderDetailLoading = (state: RootState) =>
  state.sales.detailLoading;
export const selectCreatorOrderDetailError = (state: RootState) =>
  state.sales.detailError;

export default salesSlice.reducer;
