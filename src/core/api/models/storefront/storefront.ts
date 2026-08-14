import { ProductStatus, ProductType } from '../product';
import { User } from '../user';

export type StorefrontAppearance = 'LIGHT' | 'DARK';

export type StorefrontTypography = 'MODERN' | 'CLASSIC' | 'FRIENDLY';

export interface StorefrontTheme {
  appearance: StorefrontAppearance;
  accentColor: string;
  typography: StorefrontTypography;
}
export interface PublicStorefrontCreator {
  id: string;
  displayName: string;
  email?: string;
  title?: string;
  tagline?: string;
  bio?: string;
  website?: string;
  publicEmail?: string;
  imageUrl?: string;
  socialLinks?: User['socialLinks'];
}

export interface PublicStorefrontProduct {
  id: string;
  title: string;
  description?: string;
  type: ProductType;
  status?: ProductStatus;
  price?: number | 'free';
  imageUrl?: string;
}

export interface PublicStorefront {
  id: string;
  creator: PublicStorefrontCreator;
  featuredProductId?: string;
  products: PublicStorefrontProduct[];
  theme: StorefrontTheme;
}

export interface CreatorStorefrontConfig {
  id?: string;
  featuredProductId?: string | null;
  productOrderIds: string[];
  theme: StorefrontTheme;
  updatedAt?: string;
}

export interface CreatorStorefrontConfigUpdateRequest {
  featuredProductId?: string | null;
  productOrderIds: string[];
  theme: StorefrontTheme;
}
