import { DownloadProduct } from '../models/product/download-product';
import { BaseProduct, ICreateProduct, IUpdateProduct } from '../models/product/product';
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
    const response = await httpClient.get<BaseProduct[]>('api/product/getAll?user=' + userId, {
      headers: { 'X-CSRF-Force': true }
    });
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
    throw error;
  }
};

export const getProductByProductIdAPI = async (productId: string) => {
  try {
    const response = await httpClient.get<DownloadProduct>('api/product/get?productId=' + productId);
    return response.data;
  } catch (error) {
    console.error(`Error retrieving product with id ${productId}:`, error);
    throw error;
  }
};

export const updateProductAPI = async (updatedProduct: IUpdateProduct) => {
  try {
    const response = await httpClient.post<CeSaZic>('api/products/update', updatedProduct);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${updatedProduct.id}:`, error);
    throw error;
  }
};