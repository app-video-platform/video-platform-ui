import { DownloadProduct } from '../models/product/download-product';
import {
  BaseProduct,
  ICreateCourseProduct,
  ICreateProduct,
  INewProductPayload,
  IUpdateCourseProduct,
  IUpdateProduct,
} from '../models/product/product';
import { ProductType } from '../models/product/product.types';
import httpClient from './http-client';

export interface IProductResponse {
  type?: string;
  id: string;
  name?: string;
  description?: string;
  status?: string;
  price?: 'free' | number;
  userId?: string;
  sections?: Sectiunile[];
}

export interface Sectiunile {
  id: string;
  title?: string;
  description?: string;
  position?: number;
  content?: any; // Can be text, video, etc.
}

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
    console.error('Error creating product:', error);
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

export const createNewProductAPI = async (product: ICreateProduct) => {
  try {
    const response = await httpClient.post<IProductResponse>(
      'api/products',
      product,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating new product:', error);
    return Promise.reject(error || 'Failed to create product');
  }
};

export const getProductByProductIdAPI = async (
  productId: string,
  productType: ProductType
) => {
  try {
    const response = await httpClient.get<DownloadProduct>(
      `api/products/getProduct?productId=${productId}&type=${productType}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error retrieving product with id ${productId}:`, error);
    throw error;
  }
};

export const updateProductAPI = async (updatedProduct: IUpdateProduct) => {
  try {
    const response = await httpClient.put<IProductResponse>(
      'api/products',
      updatedProduct
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating product with id ${updatedProduct.id}:`,
      error
    );
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

export const addFileToSectionAPI = async (file: File, sectionId: string) => {
  try {
    const response = await httpClient.post<string>(
      'api/files/upload-section-file',
      { file, sectionId }
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding file to section with id ${sectionId}:`, error);
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

// Utility function to read CSRF cookie
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};
