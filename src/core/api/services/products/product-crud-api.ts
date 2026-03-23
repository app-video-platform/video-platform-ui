/* eslint-disable no-console */
import httpClient from '../../http-client';
import {
  AbstractProduct,
  AbstractProductApiResponse,
  AbstractProductBase,
  CreateProductPayload,
  ProductMinimised,
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
