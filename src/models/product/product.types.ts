import { CourseProduct } from './course-product';
import { DownloadProduct } from './download-product';

export type ProductType = 'Course' | 'Download' | 'Consultation';

export type ProductStatus = 'draft' | 'published' | 'hidden';

export type Product = DownloadProduct | CourseProduct;