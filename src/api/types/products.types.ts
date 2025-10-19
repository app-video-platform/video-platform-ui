import {
  DownloadProduct,
  CourseProduct,
  ConsultationProduct,
} from '../models/product/product';

export type AbstractProduct =
  | DownloadProduct
  | CourseProduct
  | ConsultationProduct;

export type ProductType = 'COURSE' | 'DOWNLOAD' | 'CONSULTATION';

export type ProductStatus = 'draft' | 'published' | 'hidden';

export type LessonType = 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'ASSIGNMENT';
