import { IconType } from 'react-icons';
import { MeetingMethod } from '../../types/meeting-method.types';
import { ProductStatus, ProductType } from '../../types/products.types';
import { ConnectedCalendar } from '../calendars/connected-calendar';
import { CourseProductSection, DownloadSection } from './section';

export interface AbstractProductBase {
  id: string;
  type: ProductType;
  name: string;
  description?: string;
  status?: ProductStatus;
  price?: 'free' | number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
  sections?: any[];
}

export interface DownloadProduct extends AbstractProductBase {
  type: 'DOWNLOAD';
  sections?: DownloadSection[];
}

// ----- Course product (request)
export interface CourseProduct extends AbstractProductBase {
  type: 'COURSE';
  sections?: CourseProductSection[];
}

export interface ConsultationProduct extends AbstractProductBase {
  type: 'CONSULTATION';
  durationMinutes?: number;
  meetingMethod?: MeetingMethod;
  customLocation?: string;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  maxSessionsPerDay?: number;
  confirmationMessage?: string;
  cancellationPolicy?: string;
  connectedCalendars?: ConnectedCalendar[];
}

export interface ProductMinimised {
  id?: string;
  name?: string;
  type?: ProductType;
  price?: number | 'free';
  createdById?: string;
  createdByName?: string;
  createdByTitle?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRemoveItemPayload {
  id: string;
  userId: string;
}

export interface IRemoveProductPayload extends IRemoveItemPayload {
  productType: ProductType;
}

export interface TypeMeta {
  icon: IconType;
  color: string;
}
