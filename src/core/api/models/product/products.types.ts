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

export interface CourseProductResponseDetails {
  sections?: CourseProduct['sections'];
}

export interface DownloadProductResponseDetails {
  sections?: DownloadProduct['sections'];
}

export type ConsultationProductResponseDetails =
  | ConsultationProduct['consultationDetails']
  | {
      consultationDetails?: ConsultationProduct['consultationDetails'];
    };

export type CourseProductApiResponse = CourseProduct & {
  details?: CourseProductResponseDetails | null;
};

export type DownloadProductApiResponse = DownloadProduct & {
  details?: DownloadProductResponseDetails | null;
};

export type ConsultationProductApiResponse = ConsultationProduct & {
  details?: ConsultationProductResponseDetails | null;
};

export type AbstractProductApiResponse =
  | CourseProductApiResponse
  | DownloadProductApiResponse
  | ConsultationProductApiResponse;

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
