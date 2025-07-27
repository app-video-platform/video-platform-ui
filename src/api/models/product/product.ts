import { DownloadSection } from './download-section';
import { ILesson } from './lesson';
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

export interface IProductResponse {
  type?: ProductType;
  id: string;
  name?: string;
  description?: string;
  status?: string;
  price?: 'free' | number;
  userId?: string;
  sections?: Sectiunile[];
}

export interface IMinimalProduct {
  id: string;
  title: string;
  type: ProductType;
  price: 'free' | number;
  createdById: string;
  createdByName: string;
  createdByTitle: string;
  createdAt: Date;
  updatedAt: Date;
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

export type SectionContentType = string;

export interface IUpdateSectionDetails {
  productId?: string;
  id?: string;
  title?: string;
  description?: string;
  position: number;
  content?: SectionContentType;
  userId: string;
  files?: File[];
}

export interface Sectiunile {
  id?: string;
  title?: string;
  description?: string;
  position?: number;
  content?: SectionContentType; // Can be text, video, etc.
  lessons?: ILesson[];
}

export interface IRemoveItemPayload {
  id: string;
  userId: string;
}

export interface IRemoveProductPayload extends IRemoveItemPayload {
  productType: ProductType;
}
