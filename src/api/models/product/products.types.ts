import {
  DownloadProduct,
  CourseProduct,
  ConsultationProduct,
  AbstractProductBase,
} from './product';

export type AbstractProduct =
  | DownloadProduct
  | CourseProduct
  | ConsultationProduct;

export type ProductType = 'COURSE' | 'DOWNLOAD' | 'CONSULTATION';

export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export type LessonType = 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'ASSIGNMENT';

export type ProductWithSections = Extract<
  AbstractProduct,
  { type: 'COURSE' | 'DOWNLOAD' }
>;

export type Section = NonNullable<ProductWithSections['sections']>[number];

export type CreateProductPayload = Pick<
  AbstractProductBase,
  'name' | 'status' | 'type' | 'userId'
>;
