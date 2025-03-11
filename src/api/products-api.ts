import { BaseProduct } from '../models/product/product';
import httpClient from './http-client';


export const getAllProductsByUserIdAPI = async (userId: string) => {
  try {
    const response = await httpClient.get<BaseProduct>('api/product/getAll?user=' + userId, {
      headers: { 'X-CSRF-Force': true }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
};

export const createNewProductAPI = async () => {
  try {
    const response = await httpClient.post<BaseProduct>('api/product/create');
    return response.data;
  } catch (error) {
    console.error('Error creating new product:', error);
    throw error;
  }
};