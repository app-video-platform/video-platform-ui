import { DownloadProduct } from '../models/product/download-product';
import { BaseProduct, ICreateProduct, IUpdateProduct } from '../models/product/product';
import { ProductType } from '../models/product/product.types';
import httpClient from './http-client';


export interface CeSaZic {
  type: string;
  id: string;
  name: string;
  description: string;
  status: string;
  price: 'free' | number;
  userId: string;
  sections: Sectiunile[];
}

export interface Sectiunile {
  id: string;
  title: string;
  description: string;
  position: number;
}

export const getAllProductsByUserIdAPI = async (userId: string) => {
  try {
    const response = await httpClient.get<CeSaZic[]>('api/products?userId=' + userId);
    return response.data;
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
};

export const createNewProductAPI = async (product: ICreateProduct) => {
  try {
    const response = await httpClient.post<CeSaZic>('api/products', product, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error creating new product:', error);
    return Promise.reject(error || 'Failed to create product');
  }
};

export const getProductByProductIdAPI = async (productId: string, productType: ProductType) => {
  try {
    const response = await httpClient.get<DownloadProduct>(`api/products/getProduct?productId=${productId}&type=${productType}`);
    return response.data;
  } catch (error) {
    console.error(`Error retrieving product with id ${productId}:`, error);
    throw error;
  }
};

export const updateProductAPI = async (updatedProduct: IUpdateProduct) => {
  try {
    const response = await httpClient.put<CeSaZic>('api/products', updatedProduct);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${updatedProduct.id}:`, error);
    throw error;
  }
};

export const addImageToProductAPI = async (image: File, productId: string) => {
  try {
    const response = await httpClient.post<string>(`api/products/image?productId=${productId}`, image);
    return response.data;
  } catch (error) {
    console.error(`Error adding image to product with id ${productId}:`, error);
    throw error;
  }
};

export const addFileToSectionAPI = async (file: File, sectionId: string) => {
  try {
    const response = await httpClient.post<string>('api/files/upload-section-file', { file, sectionId });
    return response.data;
  } catch (error) {
    console.error(`Error adding file to section with id ${sectionId}:`, error);
    throw error;
  }
};