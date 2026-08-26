import {
  AbstractProduct,
  ProductLandingPageConfig,
  ProductLandingPageConfigUpdateRequest,
  ProductLandingPageSectionId,
  ProductBillingInterval,
  ProductCurrency,
  PublicStorefront,
  StorefrontTheme,
  User,
} from 'core/api/models';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import {
  DEFAULT_STOREFRONT_THEME,
  getProfileFromUser,
  isPublishedProductStatus,
} from 'domains/app/features/storefront';

import {
  ProductLandingCreatorViewModel,
  ProductLandingPageViewModel,
  ProductLandingPriceViewModel,
  ProductLandingTypeSummary,
} from './product-landing-page.types';

export const PRODUCT_LANDING_PAGE_SECTIONS: ProductLandingPageSectionId[] = [
  'ABOUT',
  'CONTENTS',
  'CREATOR',
];

export const DEFAULT_PRODUCT_LANDING_PAGE_CONFIG: ProductLandingPageConfigUpdateRequest = {
  marketingDescription: '',
  heroLayout: 'MEDIA_RIGHT',
  visibleSections: ['CONTENTS', 'CREATOR'],
  sectionOrder: PRODUCT_LANDING_PAGE_SECTIONS,
};

export const productLandingPageSectionLabels: Record<
  ProductLandingPageSectionId,
  string
> = {
  ABOUT: 'About',
  CONTENTS: 'What\'s included',
  CREATOR: 'Creator',
};

const billingIntervalLabels: Record<ProductBillingInterval, string> = {
  MONTH: 'month',
  YEAR: 'year',
};

const meetingMethodLabels: Record<string, string> = {
  ZOOM: 'Zoom',
  GOOGLE_MEET: 'Google Meet',
  PHONE: 'Phone',
  OTHER: 'Other',
};

export const normalizeProductLandingPageConfig = (
  productId: string,
  config?: Partial<ProductLandingPageConfig> | null,
): ProductLandingPageConfig => {
  const hasVisibleSections = Array.isArray(config?.visibleSections);
  const visibleSectionSource = hasVisibleSections && config?.visibleSections
    ? config.visibleSections
    : DEFAULT_PRODUCT_LANDING_PAGE_CONFIG.visibleSections;
  const visibleSections = visibleSectionSource.filter((section): section is ProductLandingPageSectionId =>
    PRODUCT_LANDING_PAGE_SECTIONS.includes(section as ProductLandingPageSectionId),
  );
  const orderedKnownSections = (
    config?.sectionOrder ?? DEFAULT_PRODUCT_LANDING_PAGE_CONFIG.sectionOrder
  ).filter((section): section is ProductLandingPageSectionId =>
    PRODUCT_LANDING_PAGE_SECTIONS.includes(section as ProductLandingPageSectionId),
  );
  const sectionOrder = [
    ...orderedKnownSections,
    ...PRODUCT_LANDING_PAGE_SECTIONS.filter(
      (section) => !orderedKnownSections.includes(section),
    ),
  ];

  return {
    id: config?.id,
    productId: config?.productId ?? productId,
    marketingDescription: config?.marketingDescription ?? '',
    heroLayout:
      config?.heroLayout ?? DEFAULT_PRODUCT_LANDING_PAGE_CONFIG.heroLayout,
    visibleSections,
    sectionOrder,
    updatedAt: config?.updatedAt,
  };
};

const getVisibleLandingSections = ({
  config,
  hasCreator,
}: {
  config: ProductLandingPageConfig;
  hasCreator: boolean;
}) =>
  config.sectionOrder.filter((section) => {
    if (!config.visibleSections.includes(section)) {
      return false;
    }

    if (section === 'ABOUT') {
      return Boolean(config.marketingDescription?.trim());
    }

    if (section === 'CREATOR') {
      return hasCreator;
    }

    return true;
  });

export const isPublicProductLandingPageProduct = (product: AbstractProduct) =>
  isPublishedProductStatus(product.status);

const formatCurrency = (
  amount: number,
  currency: ProductCurrency = 'EUR',
) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

export const getProductLandingPrice = (
  product: AbstractProduct,
): ProductLandingPriceViewModel => {
  const isFree = product.price === 'free' || product.price === 0;
  const isRecurring = product.pricingModel === 'RECURRING';
  const cadence = isRecurring && product.billingInterval
    ? billingIntervalLabels[product.billingInterval]
    : undefined;

  if (isFree) {
    return {
      label: 'Free',
      cadence,
      isFree: true,
      isRecurring,
    };
  }

  if (typeof product.price === 'number') {
    return {
      label: formatCurrency(product.price, product.currency),
      cadence,
      isFree: false,
      isRecurring,
    };
  }

  return {
    label: 'Price unavailable',
    cadence,
    isFree: false,
    isRecurring,
  };
};

const getProductLandingCta = (price: ProductLandingPriceViewModel) => {
  if (price.isRecurring) {
    return {
      label: 'Membership checkout unavailable',
      description:
        'Membership subscriptions are not connected yet. This page is available for product information only.',
    };
  }

  if (price.isFree) {
    return {
      label: 'Access currently unavailable',
      description:
        'Free access is not connected yet. This page is available for product information only.',
    };
  }

  return {
    label: 'Purchase currently unavailable',
    description:
      'Checkout is not connected yet. This page is available for product information only.',
  };
};

const getProductLandingCreator = ({
  product,
  currentUser,
  publicStorefront,
}: {
  product: AbstractProduct;
  currentUser?: User | null;
  publicStorefront?: PublicStorefront | null;
}): ProductLandingCreatorViewModel | undefined => {
  if (publicStorefront?.creator) {
    return {
      displayName: publicStorefront.creator.displayName,
      title: publicStorefront.creator.title,
      bio: publicStorefront.creator.bio,
      imageUrl: publicStorefront.creator.imageUrl,
      website: publicStorefront.creator.website,
      publicEmail: publicStorefront.creator.publicEmail,
    };
  }

  if (currentUser?.id && currentUser.id === product.userId) {
    const profile = getProfileFromUser(currentUser);

    return {
      displayName: profile.displayName,
      title: profile.title,
      bio: profile.bio,
      imageUrl: profile.imageUrl,
      website: profile.website,
      publicEmail: profile.publicEmail,
    };
  }

  return undefined;
};

const getProductLandingSummary = (
  product: AbstractProduct,
  price: ProductLandingPriceViewModel,
): ProductLandingTypeSummary => {
  if (product.type === 'COURSE') {
    const sections = product.sections ?? [];
    const mappedSections = sections.map((section, index) => ({
      id: section.id,
      title: section.title || `Module ${index + 1}`,
      description: section.description,
      lessonCount: section.lessons?.length ?? 0,
      lessons:
        section.lessons?.map((lesson) => ({
          id: lesson.id,
          title: lesson.title || 'Untitled lesson',
          type: lesson.type,
        })) ?? [],
    }));

    return {
      type: 'COURSE',
      sectionCount: mappedSections.length,
      lessonCount: mappedSections.reduce(
        (total, section) => total + section.lessonCount,
        0,
      ),
      sections: mappedSections,
    };
  }

  if (product.type === 'DOWNLOAD') {
    const sections = product.sections ?? [];
    const mappedSections = sections.map((section, index) => ({
      id: section.id,
      title: section.title || `Section ${index + 1}`,
      description: section.description,
      fileCount: section.files?.length ?? 0,
      files:
        section.files?.map((file) => ({
          id: file.id,
          fileName: file.fileName || 'Untitled file',
        })) ?? [],
    }));

    return {
      type: 'DOWNLOAD',
      sectionCount: mappedSections.length,
      fileCount: mappedSections.reduce(
        (total, section) => total + section.fileCount,
        0,
      ),
      sections: mappedSections,
    };
  }

  if (product.type === 'CONSULTATION') {
    const details = product.consultationDetails;
    const rows: Array<{ label: string; value: string }> = [];

    if (details?.durationMinutes) {
      rows.push({
        label: 'Session duration',
        value: `${details.durationMinutes} minutes`,
      });
    }

    if (details?.meetingMethod) {
      rows.push({
        label: 'Meeting method',
        value:
          meetingMethodLabels[details.meetingMethod] ?? details.meetingMethod,
      });
    }

    if (details?.customLocation) {
      rows.push({ label: 'Meeting details', value: details.customLocation });
    }

    if (details?.bufferBeforeMinutes || details?.bufferAfterMinutes) {
      rows.push({
        label: 'Session buffer',
        value: [
          details.bufferBeforeMinutes
            ? `${details.bufferBeforeMinutes} min before`
            : undefined,
          details.bufferAfterMinutes
            ? `${details.bufferAfterMinutes} min after`
            : undefined,
        ].filter(Boolean).join(', '),
      });
    }

    if (details?.maxSessionsPerDay) {
      rows.push({
        label: 'Daily availability',
        value: `${details.maxSessionsPerDay} sessions per day`,
      });
    }

    if (details?.confirmationMessage) {
      rows.push({ label: 'After booking', value: details.confirmationMessage });
    }

    if (details?.cancellationPolicy) {
      rows.push({
        label: 'Cancellation policy',
        value: details.cancellationPolicy,
      });
    }

    if (details?.connectedCalendars?.length) {
      rows.push({ label: 'Calendar availability', value: 'Connected' });
    }

    return {
      type: 'CONSULTATION',
      details: rows,
    };
  }

  return {
    type: 'MEMBERSHIP',
    recurringLabel: price.cadence ? `${price.label} / ${price.cadence}` : price.label,
  };
};

export const getProductLandingPageViewModel = ({
  product,
  currentUser,
  publicStorefront,
  creatorStorefrontTheme,
  landingPageConfig,
}: {
  product: AbstractProduct;
  currentUser?: User | null;
  publicStorefront?: PublicStorefront | null;
  creatorStorefrontTheme?: StorefrontTheme;
  landingPageConfig?: Partial<ProductLandingPageConfig> | null;
}): ProductLandingPageViewModel => {
  const price = getProductLandingPrice(product);
  const typeLabel = PRODUCT_TYPE_REGISTRY[product.type].label;
  const theme =
    publicStorefront?.theme ?? creatorStorefrontTheme ?? DEFAULT_STOREFRONT_THEME;
  const config = normalizeProductLandingPageConfig(product.id, landingPageConfig);
  const creator = getProductLandingCreator({
    product,
    currentUser,
    publicStorefront,
  });

  // Transitional composition: the route currently maps the general Product read
  // plus optional Storefront/User data into this public-facing shape. A future
  // public Product read model should be able to hydrate this boundary directly.
  return {
    id: product.id,
    type: product.type,
    typeLabel,
    name: product.name || 'Untitled product',
    description: product.description,
    imageUrl: product.imageUrl,
    imageAlt: product.imageUrl
      ? `${product.name || 'Product'} thumbnail`
      : '',
    galleryImages: (product.galleryImages ?? [])
      .filter((image) => image.status !== 'FAILED')
      .slice()
      .sort((first, second) => first.position - second.position),
    promoVideo: product.promoVideo,
    price,
    cta: getProductLandingCta(price),
    theme,
    creator,
    heroLayout: config.heroLayout,
    marketingDescription: config.marketingDescription?.trim(),
    sections: getVisibleLandingSections({
      config,
      hasCreator: Boolean(creator),
    }),
    summary: getProductLandingSummary(product, price),
  };
};
