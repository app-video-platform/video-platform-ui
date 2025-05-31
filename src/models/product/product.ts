import { DownloadSection } from './download-section';
import { ProductType, ProductStatus } from './product.types';

export interface BaseProduct {
  id: string;
  name: string;
  description: string; // Limit 420 characters
  image: string; // URL to image (jpeg, png, etc.)
  type: ProductType;
  status: ProductStatus;
  userId: string;
  price: 'free' | number;
  customers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProduct {
  name: string;
  description: string; // Limit 420 characters
  type: ProductType;
  status: ProductStatus;
  userId: string;
  price: 'free' | number;
  sections: DownloadSection[];
}

export interface INewProductPayload {
  name: string;
  description: string;
  type: ProductType;
  userId: string;
  status: 'draft';
}

export interface ICreateCourseProduct {
  name?: string;
  description?: string; // Limit 420 characters
  type?: ProductType;
  status?: ProductStatus;
  userId: string;
  price?: 'free' | number;
}

export interface IUpdateCourseProduct {
  name?: string;
  description?: string; // Limit 420 characters
  type?: ProductType;
  status?: ProductStatus;
  userId: string;
  price?: 'free' | number;
  id: string;
}

export interface IUpdateCourseDetailsPayload {
  productId: string;
  details: ICreateCourseProduct;
}

export interface IUpdateProduct {
  id: string;
  name: string;
  description: string; // Limit 420 characters
  type: ProductType;
  status: ProductStatus;
  userId: string;
  price: 'free' | number;
  sections: DownloadSection[];
}
