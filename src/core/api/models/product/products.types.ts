import {
  DownloadProduct,
  CourseProduct,
  ConsultationProduct,
  MembershipProduct,
  AbstractProductBase,
} from './product';

export type AbstractProduct =
  | DownloadProduct
  | CourseProduct
  | ConsultationProduct
  | MembershipProduct;

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

type ApiPrice = { price?: number | string | null };

export type CourseProductApiResponse = Omit<CourseProduct, 'price'> & ApiPrice & {
  details?: CourseProductResponseDetails | null;
};

export type DownloadProductApiResponse = Omit<DownloadProduct, 'price'> & ApiPrice & {
  details?: DownloadProductResponseDetails | null;
};

export type ConsultationProductApiResponse = Omit<ConsultationProduct, 'price'> & ApiPrice & {
  details?: ConsultationProductResponseDetails | null;
};

export type MembershipProductApiResponse = Omit<MembershipProduct, 'price'> & ApiPrice & {
  details?: null;
};

export type AbstractProductApiResponse =
  | CourseProductApiResponse
  | DownloadProductApiResponse
  | ConsultationProductApiResponse
  | MembershipProductApiResponse;

export type ProductType = 'COURSE' | 'DOWNLOAD' | 'CONSULTATION' | 'MEMBERSHIP';

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
