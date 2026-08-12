import { ProductStatus, ProductType } from '../product';
import { User } from '../user';

export interface PublicStorefrontCreator {
  id: string;
  displayName: string;
  title?: string;
  tagline?: string;
  bio?: string;
  website?: string;
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
}

export interface CreatorStorefrontConfig {
  id?: string;
  featuredProductId?: string | null;
  productOrderIds: string[];
  updatedAt?: string;
}

export interface CreatorStorefrontConfigUpdateRequest {
  featuredProductId?: string | null;
  productOrderIds: string[];
}
