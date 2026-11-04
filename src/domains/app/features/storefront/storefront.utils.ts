import {
  ProductMinimised,
  ProductStatus,
  ProductType,
  PublicStorefront,
  StorefrontTheme,
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

export const DEFAULT_STOREFRONT_THEME: StorefrontTheme = {
  appearance: 'DARK',
  accentColor: '#ffbd41',
  typography: 'MODERN',
};

export const isPublishedProductStatus = (status?: ProductStatus) =>
  status === 'PUBLISHED';

export const isPublicStorefrontProduct = (product: ProductMinimised) =>
  isPublishedProductStatus(product.status);

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
  const name = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
  return name || 'Creator';
};

export const getProfileFromUser = (user?: User | null): StorefrontProfile => ({
  id: user?.id,
  displayName: getStorefrontDisplayName(user),
  title: user?.title,
  tagline: user?.taglineMission,
  bio: user?.bio,
  website: user?.website,
  publicEmail: user?.publicEmail,
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
  const byId = new Map(products.map((product) => [product.id, product]));
  const ordered = [...new Set(orderedIds)]
    .map((id) => byId.get(id))
    .filter((product): product is StorefrontProduct => Boolean(product));
  const remaining = products.filter((product) => !orderedIds.includes(product.id));
  const timestamp = (value?: Date | string) => {
    if (!value) {
      return null;
    }
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? null : time;
  };
  // Missing creation metadata cannot distinguish an unknown date from a null
  // backend date. Retain input order until a complete ordering can be derived.
  if (remaining.some((product) => timestamp(product.createdAt) === null)) {
    return [...ordered, ...remaining];
  }
  remaining.sort((left, right) => {
    const a = timestamp(left.createdAt);
    const b = timestamp(right.createdAt);
    if (a !== b) {
      return a === null ? 1 : b === null ? -1 : b - a;
    }
    const fraction = (value?: Date | string) => {
      const text = value instanceof Date ? value.toISOString() : value ?? '';
      return (text.match(/T\d\d:\d\d:\d\d\.(\d+)/)?.[1] ?? '').padEnd(9, '0').slice(0, 9);
    };
    const leftFraction = fraction(left.createdAt);
    const rightFraction = fraction(right.createdAt);
    if (leftFraction !== rightFraction) {
      return leftFraction > rightFraction ? -1 : 1;
    }
    // Java UUID.compareTo compares the two signed 64-bit halves.
    const uuidKey = (id: string) => {
      const hex = id.toLowerCase().replace(/-/g, '');
      if (!/^[0-9a-f]{32}$/.test(hex)) {
        return id;
      }
      const signedHalf = (half: string) =>
        (parseInt(half[0], 16) ^ 8).toString(16) + half.slice(1);
      return signedHalf(hex.slice(0, 16)) + signedHalf(hex.slice(16));
    };
    const leftKey = uuidKey(left.id);
    const rightKey = uuidKey(right.id);
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
  });

  return [...ordered, ...remaining];
};

export const getStorefrontViewModel = ({
  profile,
  products,
  featuredProductId,
  theme,
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
    theme,
  };
};

export const getStorefrontViewModelFromPublicStorefront = (
  storefront: PublicStorefront,
): StorefrontViewModel =>
  getStorefrontViewModel({
    profile: {
      id: storefront.creator.id,
      displayName: storefront.creator.displayName,
      title: storefront.creator.title,
      tagline: storefront.creator.tagline,
      bio: storefront.creator.bio,
      website: storefront.creator.website,
      publicEmail: storefront.creator.publicEmail,
      imageUrl: storefront.creator.imageUrl,
      socialLinks: storefront.creator.socialLinks,
    },
    products: storefront.products.map((product) => ({
      ...product,
      status: product.status ?? 'PUBLISHED',
    })),
    featuredProductId: storefront.featuredProductId,
    theme: storefront.theme ?? DEFAULT_STOREFRONT_THEME,
  });
