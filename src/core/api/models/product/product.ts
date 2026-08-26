import { IconType } from 'react-icons';
import { ConnectedCalendar } from '../calendars/connected-calendar';
import { MeetingMethod } from './meeting-method.types';
import { ProductType, ProductStatus } from './products.types';
import { ProductSection } from './section';

export type ProductPricingModel = 'ONE_TIME' | 'RECURRING';
export type ProductBillingInterval = 'MONTH' | 'YEAR';
export type ProductCurrency = 'EUR';
export type ProductMediaStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface ProductGalleryImage {
  id: string;
  url: string;
  fileName?: string;
  fileType?: string;
  size?: number;
  position: number;
  altText?: string;
  status?: ProductMediaStatus;
}

export interface ProductPromoVideo {
  id: string;
  url?: string;
  fileName?: string;
  fileType?: string;
  size?: number;
  status: ProductMediaStatus;
  thumbnailUrl?: string;
}

export interface AbstractProductBase {
  id: string;
  type: ProductType;
  name: string;
  description?: string;
  status?: ProductStatus;
  price?: 'free' | number;
  pricingModel?: ProductPricingModel;
  billingInterval?: ProductBillingInterval;
  currency?: ProductCurrency;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
  galleryImages?: ProductGalleryImage[];
  promoVideo?: ProductPromoVideo | null;
  sections?: ProductSection[];
  consultationDetails?: ConsultationDetails;
}

export interface DownloadProduct extends AbstractProductBase {
  type: 'DOWNLOAD';
  sections?: ProductSection[];
}

// ----- Course product (request)
export interface CourseProduct extends AbstractProductBase {
  type: 'COURSE';
  sections?: ProductSection[];
}

export interface ConsultationProduct extends AbstractProductBase {
  type: 'CONSULTATION';
  consultationDetails?: ConsultationDetails;
}

export interface MembershipProduct extends AbstractProductBase {
  type: 'MEMBERSHIP';
}

export interface ConsultationDetails {
  durationMinutes?: number;
  meetingMethod?: MeetingMethod;
  customLocation?: string;
  weeklyAvailability?: ConsultationDayAvailability[];
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  maxSessionsPerDay?: number;
  confirmationMessage?: string;
  cancellationPolicy?: string;
  connectedCalendars?: ConnectedCalendar[];
}

export type ConsultationWeekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface ConsultationAvailabilityWindow {
  startTime: string;
  endTime: string;
}

export interface ConsultationDayAvailability {
  day: ConsultationWeekday;
  enabled: boolean;
  windows: ConsultationAvailabilityWindow[];
}

export interface ProductMinimised {
  id?: string;
  title?: string;
  description?: string;
  type?: ProductType;
  price?: number | 'free';
  pricingModel?: ProductPricingModel;
  billingInterval?: ProductBillingInterval;
  currency?: ProductCurrency;
  status?: ProductStatus;
  imageUrl?: string;
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
