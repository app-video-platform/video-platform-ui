import { BaseProduct } from './product';

export interface CourseProduct extends BaseProduct {
  createdAt: Date;
  updatedAt: Date;
}