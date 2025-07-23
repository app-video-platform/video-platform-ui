/* eslint-disable no-console */
import httpClient from '../../http-client';
import { getCookie } from '../../../utils/cookie.util';
import { ILesson, ICreateLessonPayload } from '../../models/product/lesson';
import {
  INewProductPayload,
  IProductResponse,
  IRemoveItemPayload,
  IRemoveProductPayload,
  IUpdateCourseProduct,
  IUpdateSectionDetails,
} from '../../models/product/product';
import { ProductType } from '../../models/product/product.types';

export const createCourseProductAPI = async (payload: INewProductPayload) => {
  try {
    const response = await httpClient.post<IProductResponse>(
      'api/products',
      payload,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateCourseDetailsAPI = async (payload: IUpdateCourseProduct) => {
  try {
    const response = await httpClient.put<IProductResponse>(
      'api/products',
      payload,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProductAPI = async (payload: IRemoveProductPayload) => {
  try {
    const response = await httpClient.delete<string>(
      `api/products?userId=${payload.userId}&productType=${payload.productType}&id=${payload.id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const createSectionAPI = async (payload: IUpdateSectionDetails) => {
  try {
    const response = await httpClient.post<IUpdateSectionDetails>(
      'api/products/course/section',
      payload,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating section:', error);
    throw error;
  }
};

export const updateSectionDetailsAPI = async (
  payload: IUpdateSectionDetails
) => {
  try {
    const response = await httpClient.put<string>(
      'api/products/course/section',
      payload,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating section details:', error);
    throw error;
  }
};

export const deleteSectionAPI = async (payload: IRemoveItemPayload) => {
  try {
    const response = await httpClient.delete<string>(
      `api/products/course/section?userId=${payload.userId}&id=${payload.id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting section:', error);
    throw error;
  }
};

export const createLessonAPI = async (payload: ICreateLessonPayload) => {
  try {
    const response = await httpClient.post<ILesson>(
      'api/products/course/section/lesson',
      payload,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

export const updateLessonDetailsAPI = async (payload: ILesson) => {
  try {
    const response = await httpClient.put<string>(
      'api/products/course/section/lesson',
      payload,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

export const deleteLessonAPI = async (payload: IRemoveItemPayload) => {
  try {
    const response = await httpClient.delete<string>(
      `api/products/course/section/lesson?userId=${payload.userId}&id=${payload.id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

export const getAllProductsByUserIdAPI = async (userId: string) => {
  try {
    const response = await httpClient.get<IProductResponse[]>(
      'api/products?userId=' + userId
    );
    return response.data;
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
};

export const getProductByProductIdAPI = async (
  productId: string,
  productType: ProductType
) => {
  try {
    const response = await httpClient.get<IProductResponse>(
      `api/products/getProduct?productId=${productId}&type=${productType}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error retrieving product with id ${productId}:`, error);
    throw error;
  }
};

export const addImageToProductAPI = async (image: File, productId: string) => {
  try {
    const response = await httpClient.post<string>(
      `api/products/image?productId=${productId}`,
      image
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding image to product with id ${productId}:`, error);
    throw error;
  }
};

export const getPresignedUrlAPI = async (
  sectionId: string,
  fileName: string
) => {
  try {
    const response = await httpClient.get('/api/files/presigned-url', {
      params: {
        sectionId,
        folderType: 'DOWNLOAD_SECTION_FILES',
        filename: fileName,
      },
    });
    return response.data; // { fileId, presignedUrl, key, fileUrl }
  } catch (error) {
    console.error(
      `Error getting presigned URL for section ${sectionId}:`,
      error
    );
    throw error;
  }
};

// STEP 2: Upload file to presigned URL
export const uploadToPresignedUrl = async (
  presignedUrl: string,
  file: File
) => {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error('File upload to presigned URL failed');
    }

    return response;
  } catch (error) {
    console.error('Error uploading to presigned URL:', error);
    throw error;
  }
};

// STEP 3: Confirm file upload
export const confirmFileUploadAPI = async (payload: {
  sectionId: string;
  fileId: string;
  key: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}) => {
  try {
    const response = await httpClient.post(
      '/api/files/confirm-upload',
      payload,
      {
        withCredentials: true,
        headers: {
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error confirming file upload:', error);
    throw error;
  }
};
