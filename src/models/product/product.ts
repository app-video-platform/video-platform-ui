import { ProductType, ProductStatus } from './product.types';

export interface BaseProduct {
  id: string;
  name: string;
  description: string; // Limit 420 characters
  image: string;       // URL to image (jpeg, png, etc.)
  type: ProductType;
  status: ProductStatus;
  userId: string;
  price: 'free' | number;
  customers: number;
  createdAt: Date;
  updatedAt: Date;
}