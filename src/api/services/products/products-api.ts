/* eslint-disable no-console */
import httpClient from '../../http-client';
import { getCookie } from '../../../utils/cookie.util';
// import { ILesson, ICreateLessonPayload } from '../../models/product/lesson';
// import {
//   IMinimalProduct,
//   INewProductPayload,
//   IProductResponse,
//   IRemoveItemPayload,
//   IRemoveProductPayload,
//   IUpdateCourseProduct,
//   IUpdateSectionDetails,
// } from '../../models/product/product';
import { ProductType } from '../../models/product/product.types';
import {
  ConfirmUploadRequestDto,
  FileS3UploadResponseDto,
} from '../../models/files/confirm-upload';
import { AbstractProduct } from '../../types/products.types';
import {
  IRemoveItemPayload,
  IRemoveProductPayload,
  ProductMinimised,
} from '../../models/product/product';
import {
  CourseProductSection,
  CourseSectionCreateRequest,
  CourseSectionUpdateRequest,
} from '../../models/product/section';
import { CourseLesson, LessonCreate } from '../../models/product/lesson';

export const createProductAPI = async (payload: AbstractProduct) => {
  try {
    const response = await httpClient.post<AbstractProduct>(
      'api/products',
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProductDetailsAPI = async (payload: AbstractProduct) => {
  try {
    const response = await httpClient.put<AbstractProduct>(
      'api/products',
      payload,
      {
        withCredentials: true,
      },
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
      `api/products?userId=${payload.userId}&productType=${payload.productType}&id=${payload.id}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const createSectionAPI = async (payload: CourseSectionCreateRequest) => {
  try {
    const response = await httpClient.post<CourseProductSection>(
      'api/products/course/section',
      payload,
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
  payload: CourseSectionUpdateRequest,
) => {
  try {
    const response = await httpClient.put<string>(
      'api/products/course/section',
      payload,
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

export const deleteSectionAPI = async (payload: IRemoveItemPayload) => {
  try {
    const response = await httpClient.delete<string>(
      `api/products/course/section?userId=${payload.userId}&id=${payload.id}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting section:', error);
    throw error;
  }
};

export const createLessonAPI = async (payload: LessonCreate) => {
  try {
    const response = await httpClient.post<CourseLesson>(
      'api/products/course/section/lesson',
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

export const updateLessonDetailsAPI = async (payload: CourseLesson) => {
  try {
    const response = await httpClient.put<string>(
      'api/products/course/section/lesson',
      payload,
      {
        withCredentials: true,
      },
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
      `api/products/course/section/lesson?userId=${payload.userId}&id=${payload.id}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

export const getAllProductsByUserIdAPI = async (userId: string) => {
  try {
    const response = await httpClient.get<AbstractProduct[]>(
      'api/products?userId=' + userId,
    );
    return response.data;
  } catch (error) {
    console.error('Error getting all products by user id:', error);
    throw error;
  }
};

export const getProductByProductIdAPI = async (
  productId: string,
  productType: ProductType,
) => {
  try {
    const response = await httpClient.get<AbstractProduct>(
      `api/products/getProduct?productId=${productId}&type=${productType}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error retrieving product with id ${productId}:`, error);
    throw error;
  }
};

export const getAllProductsMinimalAPI = async () => {
  try {
    const response = await httpClient.get<ProductMinimised[]>(
      'api/products/get-all-products-min',
    );
    return response.data;
  } catch (error) {
    console.error('Error getting all minimal products:', error);
    throw error;
  }
};

export interface SearchResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  numberOfElements: number;
  empty: boolean;
}

export type SortOrder = 'asc' | 'desc';
export interface SortParam {
  field: keyof ProductMinimised;
  order: SortOrder;
}

export const fetchProducts = async (params: {
  term: string;
  page: number;
  size: number;
  sort?: SortParam;
}): Promise<SearchResponse<ProductMinimised>> => {
  try {
    const { term, page, size, sort } = params;
    const query = new URLSearchParams({
      term,
      page: String(page),
      size: String(size),
      sort: sort ? `${String(sort.field)},${sort.order}` : 'createdAt,desc',
    });
    const response = await httpClient.get(
      `/api/products/search?${query.toString()}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error getting all minimal products:', error);
    throw error;
  }
};

// export const getNewAllProductsMinimalAPI = async ({term: string}) => {
//   try {
//     const response = await httpClient.get<IMinimalProduct[]>(
//       `/api/products/search?term=${term}&page=${page}&size=${size}&sort=${field},${dir}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error getting all minimal products:', error);
//     throw error;
//   }
// };

export const getAllProductsMinimalByUserAPI = async (userId: string) => {
  try {
    const response = await httpClient.get<ProductMinimised[]>(
      `api/products/get-all-products-min?userId=${userId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error getting all minimal products by user id:', error);
    throw error;
  }
};

export const addImageToProductAPI = async (image: File, productId: string) => {
  try {
    const response = await httpClient.post<string>(
      `api/products/image?productId=${productId}`,
      image,
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding image to product with id ${productId}:`, error);
    throw error;
  }
};

export const getPresignedUrlAPI = async (
  sectionId: string,
  fileName: string,
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
      error,
    );
    throw error;
  }
};

// STEP 2: Upload file to presigned URL
export const uploadToPresignedUrl = async (
  presignedUrl: string,
  file: File,
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
export const confirmFileUploadAPI = async (
  payload: ConfirmUploadRequestDto,
) => {
  try {
    const response = await httpClient.post<FileS3UploadResponseDto>(
      '/api/files/confirm-upload',
      payload,
      {
        withCredentials: true,
        headers: {
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error confirming file upload:', error);
    throw error;
  }
};
