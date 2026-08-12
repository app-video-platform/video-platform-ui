import { ProductMinimised, ProductStatus, ProductType, User } from 'core/api/models';

export interface StorefrontProfile {
  id?: string;
  displayName: string;
  title?: string;
  tagline?: string;
  bio?: string;
  website?: string;
  imageUrl?: string;
  socialLinks?: User['socialLinks'];
}

export interface StorefrontProduct extends ProductMinimised {
  id: string;
  title: string;
  type: ProductType;
  status: ProductStatus;
}

export interface StorefrontViewModel {
  profile: StorefrontProfile;
  products: StorefrontProduct[];
  featuredProductId?: string;
}

export interface StorefrontViewModelInput {
  profile: StorefrontProfile;
  products: ProductMinimised[];
  featuredProductId?: string;
}

export type StorefrontLoadState = 'loading' | 'ready' | 'error' | 'unavailable';
