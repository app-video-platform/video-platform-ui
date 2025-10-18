import { DownloadSection } from './download-section';
import { ILesson } from './lesson';
import { ProductType, ProductStatus } from './product.types';

export interface BaseProduct {
  id: string;
  name: string;
  description: string; // Limit 420 characters
  image: string; // URL to image (jpeg, png, etc.)
  type: ProductType;
  status: ProductStatus;
  userId: string;
  price: 'free' | number;
  customers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProduct {
  name: string;
  description: string; // Limit 420 characters
  type: ProductType;
  status: ProductStatus;
  userId: string;
  price: 'free' | number;
  sections: DownloadSection[];
}

export interface INewProductPayload {
  name: string;
  description: string;
  type: ProductType;
  userId: string;
  status: 'draft';
}

export interface IProductResponse {
  type?: ProductType;
  id: string;
  name?: string;
  description?: string;
  status?: string;
  price?: 'free' | number;
  userId?: string;
  sections?: Sectiunile[];
}

export interface IMinimalProduct {
  id: string;
  title: string;
  type: ProductType;
  price: 'free' | number;
  createdById: string;
  createdByName: string;
  createdByTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateCourseProduct {
  name?: string;
  description?: string; // Limit 420 characters
  type?: ProductType;
  status?: ProductStatus;
  userId: string;
  price?: 'free' | number;
  id: string;
}

export type SectionContentType = string;

export interface IUpdateSectionDetails {
  productId?: string;
  id?: string;
  title?: string;
  description?: string;
  position: number;
  content?: SectionContentType;
  userId: string;
  files?: File[];
}

export interface Sectiunile {
  id?: string;
  title?: string;
  description?: string;
  position?: number;
  content?: SectionContentType; // Can be text, video, etc.
  lessons?: ILesson[];
}

export interface IRemoveItemPayload {
  id: string;
  userId: string;
}

export interface IRemoveProductPayload extends IRemoveItemPayload {
  productType: ProductType;
}


export interface IConsultationDetails {
  duration: number;
  meetingMethod: MeetingMethods;
  customLocation?: string;
  bufferBefore?: number;
  bufferAfter?: number;
  maxSessions?: number;
  confirmationMessage?: string;
  cancelationPolicy?: CancelationPolicy;
}

export enum MeetingMethods {
  ZOOM = 'Zoom',
  GOOGLE = 'Google Meet',
  PHONE = 'Phone',
  TEAMS = 'Microsoft Teams',
  OTHER = 'Other',
}

export interface CancelationPolicy {
  id: string;
  label: string;
  notes: string;
}

export enum CancelationPolicyId {
  NoRefunds = 'no_refunds',
  Full24h = 'full_24h',
  Full48h = 'full_48h',
  Partial24h = 'partial_24h',
  ManualReview = 'manual_review',
  CustomPolicy = 'custom_policy',
}

export const CANCELATION_POLICIES: CancelationPolicy[] = [
  {
    id: CancelationPolicyId.NoRefunds,
    label: '❌ No cancellations allowed',
    notes: 'Booking is final',
  },
  {
    id: CancelationPolicyId.Full24h,
    label: '✅ Full refund if canceled ≥ 24h in advance',
    notes: 'Industry standard; gives both sides predictability',
  },
  {
    id: CancelationPolicyId.Full48h,
    label: '🔁 Full refund if canceled ≥ 48h in advance',
    notes: 'More generous',
  },
  {
    id: CancelationPolicyId.Partial24h,
    label: '🕐 50% refund if canceled ≥ 24h in advance',
    notes: 'You keep part of the fee',
  },
  {
    id: CancelationPolicyId.ManualReview,
    label: '✉️ Cancellations allowed anytime (manual review)',
    notes: 'Student submits request, you decide offline',
  },
  {
    id: CancelationPolicyId.CustomPolicy,
    label: '⚙️ Custom policy (describe in message below)',
    notes: 'Enables custom entry in "Confirmation Message" field',
  },
];