import { Section } from './download-section';
import { BaseProduct } from './product';

export interface DownloadProduct extends BaseProduct {
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}