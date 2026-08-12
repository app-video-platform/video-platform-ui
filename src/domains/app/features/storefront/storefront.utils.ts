import {
  ProductMinimised,
  ProductStatus,
  ProductType,
  User,
} from 'core/api/models';

import {
  StorefrontProduct,
  StorefrontProfile,
  StorefrontViewModel,
  StorefrontViewModelInput,
} from './storefront.types';

export const storefrontProductTypeLabels: Record<ProductType, string> = {
  COURSE: 'Course',
  DOWNLOAD: 'Download',
  CONSULTATION: 'Consultation',
  MEMBERSHIP: 'Membership',
};

export const storefrontStatusLabels: Record<ProductStatus, string> = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  HIDDEN: 'Hidden',
};

export const isPublicStorefrontProduct = (product: ProductMinimised) =>
  product.status === 'PUBLISHED';

export const formatStorefrontPrice = (price?: number | 'free') => {
  if (price === 'free') {
    return 'Free';
  }

  if (typeof price === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price);
  }

  return 'Price unavailable';
};

export const getStorefrontDisplayName = (user?: User | null) => {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  return name || 'Creator';
};

export const getProfileFromUser = (user?: User | null): StorefrontProfile => ({
  id: user?.id,
  displayName: getStorefrontDisplayName(user),
  title: user?.title,
  tagline: user?.taglineMission,
  bio: user?.bio,
  website: user?.website,
  imageUrl: user?.imageUrl,
  socialLinks: user?.socialLinks,
});

export const getProfileFromProducts = (
  products: ProductMinimised[],
  creatorId?: string,
): StorefrontProfile => {
  const productWithCreator = products.find(
    (product) => product.createdByName || product.createdByTitle,
  );

  return {
    id: creatorId,
    displayName: productWithCreator?.createdByName || 'Creator',
    title: productWithCreator?.createdByTitle,
  };
};

export const normalizeStorefrontProduct = (
  product: ProductMinimised,
): StorefrontProduct | null => {
  if (!product.id || !product.type) {
    return null;
  }

  return {
    ...product,
    id: product.id,
    title: product.title || 'Untitled product',
    type: product.type,
    status: product.status || 'DRAFT',
  };
};

export const normalizeStorefrontProducts = (products: ProductMinimised[]) =>
  products
    .map(normalizeStorefrontProduct)
    .filter((product): product is StorefrontProduct => Boolean(product));

export const getPublicStorefrontProducts = (products: ProductMinimised[]) =>
  normalizeStorefrontProducts(products).filter(isPublicStorefrontProduct);

export const orderStorefrontProducts = (
  products: StorefrontProduct[],
  orderedIds: string[],
) => {
  if (orderedIds.length === 0) {
    return products;
  }

  const byId = new Map(products.map((product) => [product.id, product]));
  const ordered = orderedIds
    .map((id) => byId.get(id))
    .filter((product): product is StorefrontProduct => Boolean(product));
  const remaining = products.filter((product) => !orderedIds.includes(product.id));

  return [...ordered, ...remaining];
};

export const getStorefrontViewModel = ({
  profile,
  products,
  featuredProductId,
}: StorefrontViewModelInput): StorefrontViewModel => {
  const publicProducts = getPublicStorefrontProducts(products);
  const validFeaturedId = publicProducts.some(
    (product) => product.id === featuredProductId,
  )
    ? featuredProductId
    : publicProducts[0]?.id;

  return {
    profile,
    products: publicProducts,
    featuredProductId: validFeaturedId,
  };
};
