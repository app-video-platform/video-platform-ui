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

export type CourseProductSection = ProductSection;
export type DownloadSection = ProductSection;

export interface ProductSectionCreateRequest {
  title: string;
  productId: string;
  userId?: string;
  description?: string;
  position?: number;
}

export interface ProductSectionUpdateRequest {
  id?: string;
  sectionId?: string;
  userId?: string;
  productId: string;
  title?: string;
  description?: string;
  position?: number;
}

export interface RemoveSectionPayload {
  productId: string;
  sectionId?: string;
  id?: string;
  userId?: string;
}

export type CourseSectionCreateRequest = ProductSectionCreateRequest;
export type CourseSectionUpdateRequest = ProductSectionUpdateRequest;
