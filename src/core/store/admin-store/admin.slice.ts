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
  loading: boolean;
  roleUpdatingUserId: string | null;
  error: string | null;
}

const initialState: AdminState = {
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

      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminProducts.fulfilled,
        (state, action: PayloadAction<AdminProductsPage>) => {
          state.loading = false;
          state.productsPage = action.payload;
        },
      )
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load products';
      })

      .addCase(fetchAdminAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminAuditLogs.fulfilled,
        (state, action: PayloadAction<PageResponse<AdminAuditLog>>) => {
          state.loading = false;
          state.auditPage = action.payload;
        },
      )
      .addCase(fetchAdminAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load audit logs';
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
