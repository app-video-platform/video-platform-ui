import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  MembershipAggregate,
  MembershipConfigUpdateRequest,
  MembershipContent,
  MembershipContentCreateRequest,
  MembershipContentUpdateRequest,
  MembershipFeedUpdateRequest,
  RootState,
} from 'core/api/models';
import {
  createMembershipContentAPI,
  deleteMembershipContentAPI,
  getMembershipAggregateAPI,
  updateMembershipConfigAPI,
  updateMembershipContentAPI,
  updateMembershipFeedAPI,
} from 'core/api/services';
import { extractErrorMessage } from '@shared/utils';

interface MembershipState {
  byProductId: Record<string, MembershipAggregate | undefined>;
  loading: boolean;
  error: string | null;
  saving: boolean;
  saveError: string | null;
}

const initialState: MembershipState = {
  byProductId: {},
  loading: false,
  error: null,
  saving: false,
  saveError: null,
};

const replaceContent = (
  content: MembershipContent[],
  nextContent: MembershipContent,
) => {
  const existingIndex = content.findIndex((item) => item.id === nextContent.id);

  if (existingIndex === -1) {
    return [...content, nextContent];
  }

  return content.map((item, index) =>
    index === existingIndex ? nextContent : item,
  );
};

export const fetchMembershipAggregate = createAsyncThunk<
  MembershipAggregate,
  string,
  { rejectValue: string }
>('membership/fetchMembershipAggregate', async (productId, thunkAPI) => {
  try {
    return await getMembershipAggregateAPI(productId);
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

export const updateMembershipConfig = createAsyncThunk<
  MembershipAggregate,
  { productId: string; payload: MembershipConfigUpdateRequest },
  { rejectValue: string }
>('membership/updateMembershipConfig', async ({ productId, payload }, thunkAPI) => {
  try {
    return await updateMembershipConfigAPI(productId, payload);
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

export const createMembershipContent = createAsyncThunk<
  { productId: string; content: MembershipContent },
  { productId: string; payload: MembershipContentCreateRequest },
  { rejectValue: string }
>('membership/createMembershipContent', async ({ productId, payload }, thunkAPI) => {
  try {
    const content = await createMembershipContentAPI(productId, payload);
    return { productId, content };
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

export const updateMembershipContent = createAsyncThunk<
  { productId: string; content: MembershipContent },
  {
    productId: string;
    contentId: string;
    payload: MembershipContentUpdateRequest;
  },
  { rejectValue: string }
>(
  'membership/updateMembershipContent',
  async ({ productId, contentId, payload }, thunkAPI) => {
    try {
      const content = await updateMembershipContentAPI(
        productId,
        contentId,
        payload,
      );
      return { productId, content };
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const deleteMembershipContent = createAsyncThunk<
  { productId: string; contentId: string },
  { productId: string; contentId: string },
  { rejectValue: string }
>(
  'membership/deleteMembershipContent',
  async ({ productId, contentId }, thunkAPI) => {
    try {
      await deleteMembershipContentAPI(productId, contentId);
      return { productId, contentId };
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const updateMembershipFeed = createAsyncThunk<
  MembershipAggregate,
  { productId: string; payload: MembershipFeedUpdateRequest },
  { rejectValue: string }
>('membership/updateMembershipFeed', async ({ productId, payload }, thunkAPI) => {
  try {
    return await updateMembershipFeedAPI(productId, payload);
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

const setSaving = (state: MembershipState) => {
  state.saving = true;
  state.saveError = null;
};

const setSaveError = (
  state: MembershipState,
  action: PayloadAction<string | undefined>,
) => {
  state.saving = false;
  state.saveError = action.payload || 'Membership save failed';
};

const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembershipAggregate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipAggregate.fulfilled, (state, action) => {
        state.loading = false;
        state.byProductId[action.payload.productId] = action.payload;
      })
      .addCase(fetchMembershipAggregate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Membership could not load';
      })
      .addCase(updateMembershipConfig.pending, setSaving)
      .addCase(updateMembershipConfig.fulfilled, (state, action) => {
        state.saving = false;
        state.byProductId[action.payload.productId] = action.payload;
      })
      .addCase(updateMembershipConfig.rejected, setSaveError)
      .addCase(createMembershipContent.pending, setSaving)
      .addCase(createMembershipContent.fulfilled, (state, action) => {
        state.saving = false;
        const aggregate = state.byProductId[action.payload.productId];

        if (aggregate) {
          aggregate.content = replaceContent(
            aggregate.content,
            action.payload.content,
          );
        }
      })
      .addCase(createMembershipContent.rejected, setSaveError)
      .addCase(updateMembershipContent.pending, setSaving)
      .addCase(updateMembershipContent.fulfilled, (state, action) => {
        state.saving = false;
        const aggregate = state.byProductId[action.payload.productId];

        if (aggregate) {
          aggregate.content = replaceContent(
            aggregate.content,
            action.payload.content,
          );
        }
      })
      .addCase(updateMembershipContent.rejected, setSaveError)
      .addCase(deleteMembershipContent.pending, setSaving)
      .addCase(deleteMembershipContent.fulfilled, (state, action) => {
        state.saving = false;
        const aggregate = state.byProductId[action.payload.productId];

        if (aggregate) {
          aggregate.content = aggregate.content.filter(
            (item) => item.id !== action.payload.contentId,
          );
          aggregate.feed = aggregate.feed.filter(
            (entry) =>
              entry.kind !== 'CONTENT' ||
              entry.contentId !== action.payload.contentId,
          );
        }
      })
      .addCase(deleteMembershipContent.rejected, setSaveError)
      .addCase(updateMembershipFeed.pending, setSaving)
      .addCase(updateMembershipFeed.fulfilled, (state, action) => {
        state.saving = false;
        state.byProductId[action.payload.productId] = action.payload;
      })
      .addCase(updateMembershipFeed.rejected, setSaveError);
  },
});

export const selectMembershipAggregateByProductId = (
  state: RootState,
  productId?: string,
) => (productId ? state.membership.byProductId[productId] ?? null : null);

export const selectMembershipLoading = (state: RootState) =>
  state.membership.loading;
export const selectMembershipError = (state: RootState) => state.membership.error;
export const selectMembershipSaving = (state: RootState) =>
  state.membership.saving;
export const selectMembershipSaveError = (state: RootState) =>
  state.membership.saveError;

export default membershipSlice.reducer;
