import { BaseProduct, ICreateProduct } from '../models/product/product';
import httpClient from './http-client';


export interface CeSaZic {
  type: string;
  id: string;
  name: string;
  description: string;
  status: string;
  price: 'free' | number;
  userId: string;
  sections: Sectiunile;
}

export interface Sectiunile {
  id: string;
  title: string;
  description: string;
  position: number;
}

export const getAllProductsByUserIdAPI = async (userId: string) => {
  try {
    console.log('BEFORE CALL');

    const response = await httpClient.get<BaseProduct[]>('api/product/getAll?user=' + userId, {
      headers: { 'X-CSRF-Force': true }
    });
    console.log('AFTER CALL');

    return response.data;
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
};

export const createNewProductAPI = async (product: ICreateProduct) => {
  try {
    const response = await httpClient.post<CeSaZic>('api/product', product, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error creating new product:', error);
    throw error;
  }
};