/* eslint-disable indent */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createAppAsyncThunk,
  Review,
  ReviewReply,
  ReviewsListResponse,
  RootState,
} from 'core/api/models';
import { extractErrorMessage } from '@shared/utils';
import {
  deleteReviewReplyAPI,
  getAllReviewsAPI,
  replyToReviewAPI,
  toggleReviewVisibilityAPI,
  updateReviewReplyAPI,
} from 'core/api/services';

export interface ReviewsPageArgs {
  page: number;
  pageSize?: number;
  filters?: {
    productId?: string;
    rating?: number;
    status?: 'all' | 'visible' | 'hidden';
    sort?: 'newest' | 'oldest' | 'rating-high' | 'rating-low';
    search?: string;
  };
}

interface ReviewsState {
  reviews: null | Review[];
  page: number;
  pageSize?: number;
  total: number;
  loading: boolean;
  filters?: {
    productId?: string;
    rating?: number;
    status?: 'all' | 'visible' | 'hidden';
    sort?: 'newest' | 'oldest' | 'rating-high' | 'rating-low';
    search?: string;
  };
  error?: string | null;
}

const initialState: ReviewsState = {
  reviews: null,
  page: 0,
  total: 0,
  loading: false,
  filters: {},
  error: null,
};

export const getReviewsPage = createAppAsyncThunk<
  ReviewsListResponse,
  ReviewsPageArgs
>(
  'reviews/getReviewsPage',
  async ({ pageSize, page, filters }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const rev = state.reviews;

      const size = pageSize ?? rev.pageSize ?? 24;
      const currentPage = page ?? rev.page;
      const currentFilters = filters ?? rev.filters;

      const payload = {
        size,
        productId: currentFilters?.productId,
        rating: currentFilters?.rating ? String(currentFilters?.rating) : '',
        status: currentFilters?.status,
        search: currentFilters?.search,
        page: currentPage,
      };

      const res = await getAllReviewsAPI(payload);
      console.log('res', res);

      // include filters in the payload so reducer can remember them if it wants
      return res;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const toggleReviewVisibility = createAppAsyncThunk<
  { reviewId: string; visibility: boolean },
  { reviewId: string; visibility: boolean }
>(
  'reviews/toggleVisibility',
  async ({ reviewId, visibility }, { rejectWithValue }) => {
    try {
      await toggleReviewVisibilityAPI(reviewId, visibility);

      // include filters in the payload so reducer can remember them if it wants
      return { reviewId, visibility };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const replyToReview = createAppAsyncThunk<
  { reviewId: string; reply: ReviewReply },
  { reviewId: string; reply: ReviewReply }
>('reviews/reply', async ({ reviewId, reply }, { rejectWithValue }) => {
  try {
    await replyToReviewAPI(reviewId, reply);

    // include filters in the payload so reducer can remember them if it wants
    return { reviewId, reply };
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateReviewReply = createAppAsyncThunk<
  { reviewId: string; reply: ReviewReply },
  { reviewId: string; reply: ReviewReply }
>('reviews/updateReply', async ({ reviewId, reply }, { rejectWithValue }) => {
  try {
    await updateReviewReplyAPI(reviewId, reply);

    // include filters in the payload so reducer can remember them if it wants
    return { reviewId, reply };
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const deleteReply = createAppAsyncThunk<
  { reviewId: string },
  { reviewId: string }
>('reviews/deleteReply', async ({ reviewId }, { rejectWithValue }) => {
  try {
    await deleteReviewReplyAPI(reviewId);

    // include filters in the payload so reducer can remember them if it wants
    return { reviewId };
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // getReviewsPage
      .addCase(getReviewsPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getReviewsPage.fulfilled,
        (state, action: PayloadAction<ReviewsListResponse>) => {
          state.loading = false;
          state.reviews = action.payload.items;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
        },
      )
      .addCase(getReviewsPage.rejected, (state) => {
        state.loading = false;
        state.error = 'Error retrieving reviews';
      })

      // toggleReviewVisibility
      .addCase(toggleReviewVisibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        toggleReviewVisibility.fulfilled,
        (
          state,
          action: PayloadAction<{ reviewId: string; visibility: boolean }>,
        ) => {
          state.loading = false;
          const review = state.reviews?.find(
            (rev) => rev.id === action.payload.reviewId,
          );
          if (review) {
            review.hidden = action.payload.visibility;
          }
        },
      )
      .addCase(toggleReviewVisibility.rejected, (state) => {
        state.loading = false;
        state.error = 'Error toggling review visibility';
      })

      // replyToReview
      .addCase(replyToReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        replyToReview.fulfilled,
        (
          state,
          action: PayloadAction<{ reviewId: string; reply: ReviewReply }>,
        ) => {
          state.loading = false;
          const review = state.reviews?.find(
            (rev) => rev.id === action.payload.reviewId,
          );
          if (review) {
            review.reply = action.payload.reply;
          }
        },
      )
      .addCase(replyToReview.rejected, (state) => {
        state.loading = false;
        state.error = 'Error replying to review';
      })

      // updateReviewReply
      .addCase(updateReviewReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateReviewReply.fulfilled,
        (
          state,
          action: PayloadAction<{ reviewId: string; reply: ReviewReply }>,
        ) => {
          state.loading = false;
          const review = state.reviews?.find(
            (rev) => rev.id === action.payload.reviewId,
          );
          if (review) {
            review.reply = action.payload.reply;
          }
        },
      )
      .addCase(updateReviewReply.rejected, (state) => {
        state.loading = false;
        state.error = 'Error updating reply';
      })

      // deleteReply
      .addCase(deleteReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteReply.fulfilled,
        (state, action: PayloadAction<{ reviewId: string }>) => {
          state.loading = false;
          const review = state.reviews?.find(
            (rev) => rev.id === action.payload.reviewId,
          );
          if (review) {
            review.reply = null;
          }
        },
      )
      .addCase(deleteReply.rejected, (state) => {
        state.loading = false;
        state.error = 'Error deleting reply';
      });
  },
});

export default reviewsSlice.reducer;
