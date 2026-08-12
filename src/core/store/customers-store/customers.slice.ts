import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  CreatorCustomerDetail,
  CreatorCustomersPage,
  CreatorCustomersQuery,
  RootState,
} from 'core/api/models';
import {
  getCreatorCustomerDetailAPI,
  getCreatorCustomersPageAPI,
} from 'core/api/services';
import { extractErrorMessage } from '@shared/utils';

interface CustomersState {
  customersPage: CreatorCustomersPage | null;
  listLoading: boolean;
  listError: string | null;
  currentCustomer: CreatorCustomerDetail | null;
  detailLoading: boolean;
  detailError: string | null;
}

const initialState: CustomersState = {
  customersPage: null,
  listLoading: false,
  listError: null,
  currentCustomer: null,
  detailLoading: false,
  detailError: null,
};

const EMPTY_CUSTOMERS: CreatorCustomersPage['content'] = [];
const EMPTY_CUSTOMER_PRODUCT_OPTIONS: CreatorCustomersPage['productOptions'] = [];

export const fetchCreatorCustomersPage = createAsyncThunk<
  CreatorCustomersPage,
  CreatorCustomersQuery | undefined,
  { rejectValue: string }
>('customers/fetchCreatorCustomersPage', async (query, { rejectWithValue }) => {
  try {
    return await getCreatorCustomersPageAPI(query);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchCreatorCustomerDetail = createAsyncThunk<
  CreatorCustomerDetail,
  string,
  { rejectValue: string }
>('customers/fetchCreatorCustomerDetail', async (customerId, { rejectWithValue }) => {
  try {
    return await getCreatorCustomerDetailAPI(customerId);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCurrentCustomer(state) {
      state.currentCustomer = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorCustomersPage.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(
        fetchCreatorCustomersPage.fulfilled,
        (state, action: PayloadAction<CreatorCustomersPage>) => {
          state.listLoading = false;
          state.customersPage = action.payload;
        },
      )
      .addCase(fetchCreatorCustomersPage.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload ?? 'Failed to load customers';
        state.customersPage = null;
      })
      .addCase(fetchCreatorCustomerDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(
        fetchCreatorCustomerDetail.fulfilled,
        (state, action: PayloadAction<CreatorCustomerDetail>) => {
          state.detailLoading = false;
          state.currentCustomer = action.payload;
        },
      )
      .addCase(fetchCreatorCustomerDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload ?? 'Failed to load customer';
        state.currentCustomer = null;
      });
  },
});

export const { clearCurrentCustomer } = customersSlice.actions;

export const selectCreatorCustomersPage = (state: RootState) =>
  state.customers.customersPage;
export const selectCreatorCustomers = (state: RootState) =>
  state.customers.customersPage?.content ?? EMPTY_CUSTOMERS;
export const selectCreatorCustomerProductOptions = (state: RootState) =>
  state.customers.customersPage?.productOptions ?? EMPTY_CUSTOMER_PRODUCT_OPTIONS;
export const selectCreatorCustomersListLoading = (state: RootState) =>
  state.customers.listLoading;
export const selectCreatorCustomersListError = (state: RootState) =>
  state.customers.listError;
export const selectCurrentCreatorCustomer = (state: RootState) =>
  state.customers.currentCustomer;
export const selectCreatorCustomerDetailLoading = (state: RootState) =>
  state.customers.detailLoading;
export const selectCreatorCustomerDetailError = (state: RootState) =>
  state.customers.detailError;

export default customersSlice.reducer;
