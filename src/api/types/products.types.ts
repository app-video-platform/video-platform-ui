import {
  DownloadProduct,
  CourseProduct,
  ConsultationProduct,
} from '../models/product/product';

export type AbstractProduct =
  | DownloadProduct
  | CourseProduct
  | ConsultationProduct;
