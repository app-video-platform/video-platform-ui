/* eslint-disable no-console */
import httpClient from 'core/api/http-client';
import {
  CreateReviewPayload,
  ReviewPayload,
  ReviewReply,
  ReviewsListResponse,
} from 'core/api/models';

/* Customer-facing endpoints
GET  /products/:productId/reviews           // public list for that product
GET  /me/reviews?productId=:productId       // my own review for this product (if any)

POST /products/:productId/reviews           // create review (customer)
PATCH /reviews/:id                          // customer editing their own rating/comment
*/

/* Creator / admin endpoints (for your Marketing → Reviews tab)
GET   /creator/reviews?productId=&rating=&status=&search=&page=&pageSize=
PATCH /creator/reviews/:id/visibility          // hide/unhide
POST  /creator/reviews/:id/reply               // create reply
PATCH /creator/reviews/:id/reply               // edit reply
DELETE/creator/reviews/:id/reply               // remove reply (optional)
*/

export const createReviewAPI = async (payload: CreateReviewPayload) => {
  try {
    const response = await httpClient.post<string>(
      `api/products/${payload.productId}/review`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const patchReviewAPI = async (payload: ReviewPayload) => {
  try {
    const response = await httpClient.patch<string>(
      `api/review/${payload.id}`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReviewAPI = async (reviewId: string) => {
  try {
    const response = await httpClient.delete<string>(`api/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getAllReviewsAPI = async (params: {
  productId?: string;
  rating?: string;
  status?: string;
  search?: string;
  page: number;
  size: number;
}) => {
  try {
    const { productId, rating, status, search, page, size } = params;
    const query = new URLSearchParams({
      productId: productId ?? '',
      rating: rating ?? '',
      status: status ?? '',
      search: search ?? '',
      page: String(page),
      size: String(size),
    });
    const response = await httpClient.get<ReviewsListResponse>(
      `/api/creators/reviews?${query.toString()}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error getting all reviews:', error);
    throw error;
  }
};

export const toggleReviewVisibilityAPI = async (
  reviewId: string,
  visibility: boolean,
) => {
  try {
    const response = await httpClient.put<string>(
      `api/review/${reviewId}/visibility`,
      visibility,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling review visibility:', error);
    throw error;
  }
};

export const replyToReviewAPI = async (
  reviewId: string,
  payload: ReviewReply,
) => {
  try {
    const response = await httpClient.post<string>(
      `api/review/${reviewId}/reply`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error replying to review:', error);
    throw error;
  }
};

export const updateReviewReplyAPI = async (
  reviewId: string,
  payload: ReviewReply,
) => {
  try {
    const response = await httpClient.put<string>(
      `api/review/${reviewId}/reply`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling review visibility:', error);
    throw error;
  }
};

export const deleteReviewReplyAPI = async (reviewId: string) => {
  try {
    const response = await httpClient.delete<string>(
      `api/review/${reviewId}/reply`,
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting reply:', error);
    throw error;
  }
};
