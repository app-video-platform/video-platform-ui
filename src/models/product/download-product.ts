import { DownloadSection } from './download-section';
import { BaseProduct } from './product';

export interface DownloadProduct extends BaseProduct {
  sections: DownloadSection[];
  createdAt: Date;
  updatedAt: Date;
}