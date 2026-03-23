import { FileDownloadProductResponse } from '../files/file-download-product';
import { CourseLesson } from './lesson';

export interface ProductSection {
  id?: string;
  title: string;
  description?: string;
  productId?: string;
  position: number;
  lessons?: CourseLesson[];
  files?: FileDownloadProductResponse[];
}

export interface ProductSectionCreateRequest {
  title: string;
  productId: string;
  description?: string;
  position?: number;
}

export interface ProductSectionUpdateRequest {
  sectionId: string;
  productId: string;
  title?: string;
  description?: string;
  position?: number;
}

export interface RemoveSectionPayload {
  productId: string;
  sectionId: string;
}
