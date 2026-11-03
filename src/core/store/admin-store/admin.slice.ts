import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  AdminAuditLog,
  AdminAuditQuery,
  AdminProductQuery,
  AdminProductsPage,
  AdminUser,
  AdminUserQuery,
  PageResponse,
  RootState,
  UserRole,
} from 'core/api/models';
import {
  getAdminAuditAPI,
  getAdminProductsAPI,
  getAdminUsersAPI,
  updateAdminUserRoleAPI,
} from 'core/api/services';
import { extractErrorMessage } from '@shared/utils';

interface AdminState {
  usersPage: PageResponse<AdminUser> | null;
  productsPage: AdminProductsPage | null;
  auditPage: PageResponse<AdminAuditLog> | null;
  productsRequestId?: string;
  productsQueryKey?: string;
  productsLoading?: boolean;
  productsError?: string | null;
  auditRequestId?: string;
  auditQueryKey?: string;
  auditLoading?: boolean;
  auditError?: string | null;
  loading: boolean;
  roleUpdatingUserId: string | null;
  error: string | null;
}

const initialState: AdminState = {
  productsLoading: false,
  productsError: null,
  auditLoading: false,
  auditError: null,
  usersPage: null,
  productsPage: null,
  auditPage: null,
  loading: false,
  roleUpdatingUserId: null,
  error: null,
};

export const fetchAdminUsers = createAsyncThunk<
  PageResponse<AdminUser>,
  AdminUserQuery | undefined,
  { rejectValue: string }
>('admin/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    return await getAdminUsersAPI(params);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateAdminUserRole = createAsyncThunk<
  AdminUser,
  { userId: string; role: UserRole },
  { rejectValue: string }
>('admin/updateUserRole', async ({ userId, role }, { rejectWithValue }) => {
  try {
    return await updateAdminUserRoleAPI(userId, { role });
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchAdminProducts = createAsyncThunk<
  AdminProductsPage,
  AdminProductQuery | undefined,
  { rejectValue: string }
>('admin/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    return await getAdminProductsAPI(params);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchAdminAuditLogs = createAsyncThunk<
  PageResponse<AdminAuditLog>,
  AdminAuditQuery | undefined,
  { rejectValue: string }
>('admin/fetchAuditLogs', async (params, { rejectWithValue }) => {
  try {
    return await getAdminAuditAPI(params);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminUsers.fulfilled,
        (state, action: PayloadAction<PageResponse<AdminUser>>) => {
          state.loading = false;
          state.usersPage = action.payload;
        },
      )
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load users';
      })

      .addCase(updateAdminUserRole.pending, (state, action) => {
        state.roleUpdatingUserId = action.meta.arg.userId;
        state.error = null;
      })
      .addCase(
        updateAdminUserRole.fulfilled,
        (state, action: PayloadAction<AdminUser>) => {
          state.roleUpdatingUserId = null;
          if (state.usersPage) {
            state.usersPage.content = state.usersPage.content.map((user) =>
              user.id === action.payload.id ? action.payload : user,
            );
          }
        },
      )
      .addCase(updateAdminUserRole.rejected, (state, action) => {
        state.roleUpdatingUserId = null;
        state.error = action.payload ?? 'Failed to update role';
      })

      .addCase(fetchAdminProducts.pending, (state, action) => {
        state.productsRequestId = action.meta.requestId;
        state.productsQueryKey = JSON.stringify(action.meta.arg ?? {});
        state.productsLoading = true;
        state.productsError = null;
        state.productsPage = null;
      })
      .addCase(
        fetchAdminProducts.fulfilled,
        (state, action) => {
          if (!state.productsRequestId || state.productsRequestId !== action.meta?.requestId) {return;}
          state.productsRequestId = undefined;
          state.productsLoading = false;
          state.productsError = null;
          state.productsPage = action.payload;
        },
      )
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        if (!state.productsRequestId || state.productsRequestId !== action.meta?.requestId) {return;}
        state.productsRequestId = undefined;
        state.productsLoading = false;
        state.productsError = action.payload ?? 'Could not load results';
        state.productsPage = null;
      })

      .addCase(fetchAdminAuditLogs.pending, (state, action) => {
        state.auditRequestId = action.meta.requestId;
        state.auditQueryKey = JSON.stringify(action.meta.arg ?? {});
        state.auditLoading = true;
        state.auditError = null;
        state.auditPage = null;
      })
      .addCase(
        fetchAdminAuditLogs.fulfilled,
        (state, action) => {
          if (!state.auditRequestId || state.auditRequestId !== action.meta?.requestId) {return;}
          state.auditRequestId = undefined;
          state.auditLoading = false;
          state.auditError = null;
          state.auditPage = action.payload;
        },
      )
      .addCase(fetchAdminAuditLogs.rejected, (state, action) => {
        if (!state.auditRequestId || state.auditRequestId !== action.meta?.requestId) {return;}
        state.auditRequestId = undefined;
        state.auditLoading = false;
        state.auditError = action.payload ?? 'Could not load results';
        state.auditPage = null;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;

export const selectAdminUsersPage = (state: RootState) => state.admin.usersPage;
export const selectAdminProductsPage = (state: RootState) =>
  state.admin.productsPage;
export const selectAdminAuditPage = (state: RootState) => state.admin.auditPage;
export const selectAdminLoading = (state: RootState) => state.admin.loading;
export const selectAdminError = (state: RootState) => state.admin.error;
export const selectRoleUpdatingUserId = (state: RootState) =>
  state.admin.roleUpdatingUserId;

export default adminSlice.reducer;

export const selectAdminProductsLoading = (state: RootState) => state.admin.productsLoading ?? state.admin.loading;
export const selectAdminProductsError = (state: RootState) => state.admin.productsError === undefined ? state.admin.error : state.admin.productsError;
export const selectAdminProductsQueryKey = (state: RootState) => state.admin.productsQueryKey;

export const selectAdminAuditLoading = (state: RootState) => state.admin.auditLoading ?? state.admin.loading;
export const selectAdminAuditError = (state: RootState) => state.admin.auditError === undefined ? state.admin.error : state.admin.auditError;
export const selectAdminAuditQueryKey = (state: RootState) => state.admin.auditQueryKey;
