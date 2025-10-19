import { FileDownloadProductResponse } from '../files/file-download-product';
import { CourseLesson } from './lesson';

// export interface DownloadProductSection {
//   id?: string;
//   title?: string;
//   description?: string;
//   position?: number;
// }

export interface CourseProductSection {
  id?: string;
  title?: string;
  description?: string;
  productId?: string;
  position?: number;
  lessons?: CourseLesson[];
}

export interface DownloadProductSectionRequest {
  id?: string;
  title?: string;
  description?: string;
  position?: number;
}

export interface DownloadProductSectionResponse {
  id?: string;
  title?: string;
  description?: string;
  position?: number;
  files?: FileDownloadProductResponse[];
}

export interface CourseSectionCreateRequest {
  title: string;
  productId: string;
  userId: string;
  description?: string;
  position?: number;
}

export interface CourseSectionUpdateRequest {
  id: string;
  userId: string;
  productId: string;
  title?: string;
  description?: string;
  position?: number;
}
