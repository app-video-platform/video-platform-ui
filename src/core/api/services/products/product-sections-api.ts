/* eslint-disable no-console */
import httpClient from '../../http-client';
import {
  ProductSection,
  ProductSectionCreateRequest,
  ProductSectionUpdateRequest,
  RemoveSectionPayload,
} from 'core/api/models';

export const createSectionAPI = async (
  payload: ProductSectionCreateRequest,
) => {
  try {
    const response = await httpClient.post<ProductSection>(
      `api/products/${payload.productId}/sections`,
      {
        title: payload.title,
        description: payload.description,
        position: payload.position,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating section:', error);
    throw error;
  }
};

export const updateSectionDetailsAPI = async (
  payload: ProductSectionUpdateRequest,
) => {
  try {
    const response = await httpClient.patch<ProductSection>(
      `api/products/${payload.productId}/sections/${payload.sectionId}`,
      {
        title: payload.title,
        description: payload.description,
        position: payload.position,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating section details:', error);
    throw error;
  }
};

export const deleteSectionAPI = async (payload: RemoveSectionPayload) => {
  try {
    await httpClient.delete(
      `api/products/${payload.productId}/sections/${payload.sectionId}`,
    );
    return payload.sectionId;
  } catch (error) {
    console.error('Error deleting section:', error);
    throw error;
  }
};
