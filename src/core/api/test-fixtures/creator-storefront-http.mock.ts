import MockAdapter from 'axios-mock-adapter';

import {
  CreatorStorefrontConfig,
  CreatorStorefrontConfigUpdateRequest,
  ProductMinimised,
  PublicStorefront,
} from 'core/api/models';
import { SocialPlatforms } from 'core/api/models/socials/social-media-link';

export const storefrontProductSummariesTestFixture: ProductMinimised[] = [
  {
    id: 'sf-course-1',
    title: 'Creator Launch Studio',
    description:
      'A structured course for planning, filming, and launching a paid video product.',
    type: 'COURSE',
    status: 'PUBLISHED',
    price: 149,
    createdById: 'creator-1',
    createdByName: 'Maya Rivera',
    createdByTitle: 'Independent filmmaker and creator educator',
  },
  {
    id: 'sf-download-1',
    title: 'Content Calendar Kit',
    description:
      'Templates for mapping weekly videos, launches, and customer touchpoints.',
    type: 'DOWNLOAD',
    status: 'PUBLISHED',
    price: 29,
    createdById: 'creator-1',
    createdByName: 'Maya Rivera',
    createdByTitle: 'Independent filmmaker and creator educator',
  },
  {
    id: 'sf-consultation-1',
    title: 'Launch Strategy Session',
    description:
      'A focused consultation to review your product offer and launch plan.',
    type: 'CONSULTATION',
    status: 'PUBLISHED',
    price: 220,
    createdById: 'creator-1',
    createdByName: 'Maya Rivera',
    createdByTitle: 'Independent filmmaker and creator educator',
  },
  {
    id: 'sf-membership-1',
    title: 'Creator Lab Membership',
    description:
      'Monthly workshops, critiques, and member-only operating systems.',
    type: 'MEMBERSHIP',
    status: 'PUBLISHED',
    price: 39,
    createdById: 'creator-1',
    createdByName: 'Maya Rivera',
    createdByTitle: 'Independent filmmaker and creator educator',
  },
  {
    id: 'sf-draft-1',
    title: 'Unannounced Workshop',
    description: 'Draft product intentionally hidden from public Storefront.',
    type: 'COURSE',
    status: 'DRAFT',
    price: 99,
    createdById: 'creator-1',
    createdByName: 'Maya Rivera',
    createdByTitle: 'Independent filmmaker and creator educator',
  },
  {
    id: 'sf-hidden-1',
    title: 'Retired Preset Pack',
    description:
      'Hidden product intentionally excluded from public Storefront.',
    type: 'DOWNLOAD',
    status: 'HIDDEN',
    price: 19,
    createdById: 'creator-1',
    createdByName: 'Maya Rivera',
    createdByTitle: 'Independent filmmaker and creator educator',
  },
];

export const publicStorefrontTestFixture: PublicStorefront = {
  id: 'storefront-creator-1',
  creator: {
    id: 'creator-1',
    displayName: 'Maya Rivera',
    title: 'Independent filmmaker and creator educator',
    tagline:
      'Practical cinematic systems for creators building paid audiences.',
    bio: 'Maya helps video creators package their knowledge into focused courses, downloads, consultations, and membership communities.',
    website: 'https://maya.example.com',
    publicEmail: 'hello@maya.example.com',
    socialLinks: [
      { platform: SocialPlatforms.YT, url: 'https://youtube.com/@mayarivera' },
      { platform: SocialPlatforms.IG, url: 'https://instagram.com/mayarivera' },
    ],
  },
  featuredProductId: 'sf-course-1',
  theme: {
    appearance: 'DARK',
    accentColor: '#ffbd41',
    typography: 'MODERN',
  },
  products: storefrontProductSummariesTestFixture.map((product) => ({
    id: product.id ?? '',
    title: product.title ?? '',
    description: product.description,
    type: product.type ?? 'COURSE',
    status: product.status,
    price: product.price,
    imageUrl: product.imageUrl,
  })),
};

export const emptyPublicStorefrontTestFixture: PublicStorefront = {
  ...publicStorefrontTestFixture,
  id: 'storefront-empty-creator',
  creator: {
    id: 'empty-creator',
    displayName: 'Quiet Creator',
  },
  featuredProductId: undefined,
  products: [],
};

export const registerCreatorStorefrontTestMocks = (mock: MockAdapter) => {
  let config: CreatorStorefrontConfig = {
    id: 'creator-storefront-config',
    featuredProductId: 'sf-course-1',
    theme: {
      appearance: 'DARK',
      accentColor: '#ffbd41',
      typography: 'MODERN',
    },
    productOrderIds: storefrontProductSummariesTestFixture.map(
      (product) => product.id ?? '',
    ),
    updatedAt: '2026-08-12T10:00:00.000Z',
  };

  mock.onGet(/api\/storefronts\/[^/?]+$/).reply((request) => {
    const creatorId = request.url?.split('/').pop();

    if (creatorId === 'empty-creator') {
      return [200, emptyPublicStorefrontTestFixture];
    }

    if (creatorId === 'missing-creator') {
      return [404, { message: 'Storefront not found' }];
    }

    return [
      200,
      {
        ...publicStorefrontTestFixture,
        creator: {
          ...publicStorefrontTestFixture.creator,
          id: creatorId ?? publicStorefrontTestFixture.creator.id,
        },
      },
    ];
  });

  mock.onGet('api/creator/storefront').reply(() => [200, config]);
  mock.onPatch('api/creator/storefront').reply((request) => {
    const payload = JSON.parse(
      request.data ?? '{}',
    ) as CreatorStorefrontConfigUpdateRequest;
    config = {
      ...config,
      featuredProductId: payload.featuredProductId ?? null,
      productOrderIds: payload.productOrderIds,
      theme: payload.theme,
      updatedAt: '2026-08-12T11:00:00.000Z',
    };

    return [200, config];
  });

  mock
    .onGet(/api\/products\?ownerId=/)
    .reply(() => [200, storefrontProductSummariesTestFixture]);
};
