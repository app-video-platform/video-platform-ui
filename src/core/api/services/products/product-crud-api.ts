/* eslint-disable no-console */
import httpClient from '../../http-client';
import {
  AbstractProduct,
  AbstractProductApiResponse,
  AbstractProductBase,
  CreateProductPayload,
  ProductGalleryImage,
  ProductMinimised,
  ProductPromoVideo,
} from 'core/api/models';
import {
  normalizeProductResponse,
  normalizeProductSummary,
} from './utils/product-normalizers.util';

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

export const createProductAPI = async (payload: CreateProductPayload) => {
  try {
    const response = await httpClient.post<AbstractProductApiResponse>(
      'api/products',
      payload,
      {
        withCredentials: true,
      },
    );
    return normalizeProductResponse(response.data);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProductDetailsAPI = async (
  payload: AbstractProductBase,
): Promise<AbstractProduct> => {
  try {
    const response = await httpClient.patch<AbstractProductApiResponse>(
      `api/products/${payload.id}`,
      payload,
      {
        withCredentials: true,
      },
    );
    return normalizeProductResponse(response.data);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProductAPI = async (
  payload: { id?: string; productId?: string },
) => {
  const productId = payload.productId ?? payload.id;

  if (!productId) {
    throw new Error('Product id is required');
  }

  try {
    await httpClient.delete(`api/products/${productId}`);
    return productId;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getAllProductsByUserIdAPI = async (userId: string) => {
  try {
    const response = await httpClient.get<AbstractProductApiResponse[]>(
      'api/products?userId=' + userId,
    );
    return response.data.map(normalizeProductResponse);
  } catch (error) {
    console.error('Error getting all products by user id:', error);
    throw error;
  }
};

export const getProductsByOwnerAPI = async (ownerId: string) => {
  try {
    const response = await httpClient.get<ProductMinimised[]>(
      'api/products?ownerId=' + ownerId,
    );
    return response.data.map(normalizeProductSummary);
  } catch (error) {
    console.error('Error getting product summaries by owner id:', error);
    throw error;
  }
};

export const getProductByIdAPI = async (productId: string) => {
  try {
    const response = await httpClient.get<AbstractProductApiResponse>(
      `api/products/${productId}`,
    );
    return normalizeProductResponse(response.data);
  } catch (error) {
    console.error(`Error retrieving product with id ${productId}:`, error);
    throw error;
  }
};

export const getProductByProductIdAPI = async (
  productId: string,
  productType?: string,
) => {
  void productType;
  return getProductByIdAPI(productId);
};

export const getAllProductsMinimalAPI = async () => {
  try {
    const response = await httpClient.get<ProductMinimised[]>(
      'api/products/get-all-products-min',
    );
    return response.data.map(normalizeProductSummary);
  } catch (error) {
    console.error('Error getting all minimal products:', error);
    throw error;
  }
};

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
    const response = await httpClient.get<SearchResponse<ProductMinimised>>(
      `/api/products/search?${query.toString()}`,
    );
    return {
      ...response.data,
      content: response.data.content.map(normalizeProductSummary),
    };
  } catch (error) {
    console.error('Error getting all minimal products:', error);
    throw error;
  }
};

export const getAllProductsMinimalByUserAPI = async (userId: string) => {
  try {
    const response = await httpClient.get<ProductMinimised[]>(
      `api/products/get-all-products-min?userId=${userId}`,
    );
    return response.data.map(normalizeProductSummary);
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

export const removeImageFromProductAPI = async (productId: string) => {
  try {
    await httpClient.delete(`api/products/image?productId=${productId}`);
    return productId;
  } catch (error) {
    console.error(`Error removing image from product with id ${productId}:`, error);
    throw error;
  }
};

export const addProductGalleryImageAPI = async (
  productId: string,
  image: File,
): Promise<ProductGalleryImage> => {
  try {
    const response = await httpClient.post<ProductGalleryImage>(
      `api/products/${productId}/media/gallery`,
      image,
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding gallery image to product ${productId}:`, error);
    throw error;
  }
};

export const removeProductGalleryImageAPI = async (
  productId: string,
  imageId: string,
) => {
  try {
    await httpClient.delete(
      `api/products/${productId}/media/gallery/${imageId}`,
    );
    return { productId, imageId };
  } catch (error) {
    console.error(`Error removing gallery image ${imageId}:`, error);
    throw error;
  }
};

export const reorderProductGalleryImagesAPI = async (
  productId: string,
  imageIds: string[],
): Promise<ProductGalleryImage[]> => {
  try {
    const response = await httpClient.put<ProductGalleryImage[]>(
      `api/products/${productId}/media/gallery/order`,
      { imageIds },
    );
    return response.data;
  } catch (error) {
    console.error(`Error reordering gallery images for ${productId}:`, error);
    throw error;
  }
};

export const addProductPromoVideoAPI = async (
  productId: string,
  video: File,
): Promise<ProductPromoVideo> => {
  try {
    const response = await httpClient.post<ProductPromoVideo>(
      `api/products/${productId}/media/promo-video`,
      video,
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding promo video to product ${productId}:`, error);
    throw error;
  }
};

export const removeProductPromoVideoAPI = async (productId: string) => {
  try {
    await httpClient.delete(`api/products/${productId}/media/promo-video`);
    return productId;
  } catch (error) {
    console.error(`Error removing promo video from product ${productId}:`, error);
    throw error;
  }
};
