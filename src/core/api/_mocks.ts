/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { User, UserRole } from './models/user/user';
import { SearchResponse } from './services/products/products-api';
import { SocialPlatforms } from './models/socials/social-media-link';
import { ProductSectionUpdateRequest } from './models/product/section';
import { ProductMinimised } from './models/product/product';
import { AbstractProduct } from './models';

/**
 * Call this once (passing in your axios instance) to wire up all mock endpoints.
 */
export function setupMocks(client: AxiosInstance) {
  const mock = new MockAdapter(client, { delayResponse: 300 });

  const mockedUser: User = {
    id: 'mocked-user-id',
    firstName: 'Aleb',
    lastName: 'Mocked',
    email: 'aleb-mocked@example.com',
    roles: [UserRole.CREATOR],
    onboardingCompleted: true,
    bio: 'I am the one and only, some Greek symbols',
    taglineMission: 'I want to make the world',
    website: 'iamthe.one',
    city: 'Sântana',
    country: 'Romania',
    title: 'Doctor Professor G to the odd',
    socialLinks: [
      {
        id: 'id_1',
        platform: SocialPlatforms.IG,
        url: 'ig.com/alebMocked',
      },
      {
        id: 'id_2',
        platform: SocialPlatforms.TT,
        url: 'tt.com/alebMocked',
      },
    ],
  };

  const now = new Date();
  const daysAgo = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const mockProducts: AbstractProduct[] = [
    {
      type: 'COURSE',
      id: 'course-video-sprint',
      name: 'Video Sales Page Sprint',
      description:
        'A hands-on course for creators who want to script, shoot, edit, and publish a sales page video in one focused weekend.',
      status: 'PUBLISHED',
      price: 149,
      userId: 'mocked-user-id',
      createdAt: daysAgo(24),
      updatedAt: daysAgo(2),
      imageUrl:
        'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80',
      sections: [
        {
          id: 'course-video-sprint-section-1',
          productId: 'course-video-sprint',
          title: 'Position the Offer',
          description:
            'Clarify the promise, audience, objections, and call to action before recording.',
          position: 1,
          lessons: [
            {
              id: 'course-video-sprint-lesson-1',
              productId: 'course-video-sprint',
              sectionId: 'course-video-sprint-section-1',
              title: 'Map the viewer journey',
              type: 'VIDEO',
              description: 'Turn visitor intent into a persuasive video outline.',
              content:
                'Identify the before-state, desired outcome, objections, proof, and next action.',
              videoUrl: 'https://cdn.example.com/video-sales-page/journey.mp4',
              position: 1,
            },
            {
              id: 'course-video-sprint-lesson-2',
              productId: 'course-video-sprint',
              sectionId: 'course-video-sprint-section-1',
              title: 'Write a conversion script',
              type: 'ARTICLE',
              description: 'Use a tight script structure that still sounds natural.',
              content:
                'Hook, context, stakes, product promise, proof, objections, offer, and close.',
              position: 2,
            },
          ],
        },
        {
          id: 'course-video-sprint-section-2',
          productId: 'course-video-sprint',
          title: 'Produce and Publish',
          description:
            'Record with a practical setup and ship the final asset with confidence.',
          position: 2,
          lessons: [
            {
              id: 'course-video-sprint-lesson-3',
              productId: 'course-video-sprint',
              sectionId: 'course-video-sprint-section-2',
              title: 'Lighting, sound, and framing',
              type: 'VIDEO',
              description: 'Set up a clean recording environment without a studio.',
              videoUrl: 'https://cdn.example.com/video-sales-page/studio.mp4',
              content: 'A simple desk setup can look premium with careful framing.',
              position: 1,
            },
            {
              id: 'course-video-sprint-lesson-4',
              productId: 'course-video-sprint',
              sectionId: 'course-video-sprint-section-2',
              title: 'Final launch checklist',
              type: 'ASSIGNMENT',
              description: 'Export, upload, QA captions, and publish.',
              content:
                'Submit your published sales page URL and a short note on what changed.',
              position: 2,
            },
          ],
        },
      ],
    },
    {
      type: 'COURSE',
      id: 'course-analytics-lab-draft',
      name: 'Creator Analytics Lab',
      description:
        'Draft curriculum for reading funnel, retention, and revenue signals without drowning in dashboards.',
      status: 'DRAFT',
      price: 79,
      userId: 'mocked-user-id',
      createdAt: daysAgo(6),
      updatedAt: daysAgo(1),
      imageUrl:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      sections: [
        {
          id: 'course-analytics-lab-section-1',
          productId: 'course-analytics-lab-draft',
          title: 'Metrics That Matter',
          description: 'Working outline for the first module.',
          position: 1,
          lessons: [
            {
              id: 'course-analytics-lab-lesson-1',
              productId: 'course-analytics-lab-draft',
              sectionId: 'course-analytics-lab-section-1',
              title: 'North star metric',
              type: 'ARTICLE',
              description: 'Draft notes for choosing one primary product metric.',
              content: 'TODO: add examples for course, download, and membership.',
              position: 1,
            },
          ],
        },
        {
          id: 'course-analytics-lab-section-2',
          productId: 'course-analytics-lab-draft',
          title: 'Retention Review',
          description: '',
          position: 2,
          lessons: [],
        },
      ],
    },
    {
      type: 'DOWNLOAD',
      id: 'download-launch-asset-vault',
      name: 'Launch Asset Vault',
      description:
        'A polished pack of sales page sections, email swipes, pricing calculators, and launch QA templates.',
      status: 'PUBLISHED',
      price: 49,
      userId: 'mocked-user-id',
      createdAt: daysAgo(42),
      updatedAt: daysAgo(5),
      imageUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      sections: [
        {
          id: 'download-launch-asset-vault-section-1',
          productId: 'download-launch-asset-vault',
          title: 'Templates',
          description: 'Editable files for planning and publishing a launch.',
          position: 1,
          files: [
            {
              id: 'download-launch-asset-vault-file-1',
              fileName: 'sales-page-wireframes.fig',
              fileType: 'application/octet-stream',
              size: 18400000,
              url: 'https://cdn.example.com/launch-vault/sales-page-wireframes.fig',
            },
            {
              id: 'download-launch-asset-vault-file-2',
              fileName: 'launch-email-sequence.docx',
              fileType:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              size: 920000,
              url: 'https://cdn.example.com/launch-vault/email-sequence.docx',
            },
          ],
        },
        {
          id: 'download-launch-asset-vault-section-2',
          productId: 'download-launch-asset-vault',
          title: 'Calculators',
          description: 'Revenue, conversion, and cohort planning sheets.',
          position: 2,
          files: [
            {
              id: 'download-launch-asset-vault-file-3',
              fileName: 'pricing-and-revenue-calculator.xlsx',
              fileType:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              size: 640000,
              url: 'https://cdn.example.com/launch-vault/pricing-calculator.xlsx',
            },
          ],
        },
      ],
    },
    {
      type: 'DOWNLOAD',
      id: 'download-caption-pack-draft',
      name: 'Short-Form Caption Pack',
      description:
        'Draft pack of reusable hooks, captions, and description templates for short-form video.',
      status: 'DRAFT',
      price: 'free',
      userId: 'mocked-user-id',
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
      sections: [
        {
          id: 'download-caption-pack-section-1',
          productId: 'download-caption-pack-draft',
          title: 'Hook Bank',
          description: '',
          position: 1,
          files: [
            {
              id: 'download-caption-pack-file-1',
              fileName: 'hook-bank-draft.txt',
              fileType: 'text/plain',
              size: 18000,
              url: 'https://cdn.example.com/caption-pack/hook-bank-draft.txt',
            },
          ],
        },
      ],
    },
    {
      type: 'CONSULTATION',
      id: 'consultation-offer-audit',
      name: '90-Minute Offer Audit',
      description:
        'A live strategy session reviewing your product positioning, sales page, pricing, and next launch moves.',
      status: 'PUBLISHED',
      price: 325,
      userId: 'mocked-user-id',
      createdAt: daysAgo(18),
      updatedAt: daysAgo(4),
      imageUrl:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      consultationDetails: {
        durationMinutes: 90,
        meetingMethod: 'ZOOM',
        bufferBeforeMinutes: 15,
        bufferAfterMinutes: 15,
        maxSessionsPerDay: 3,
        confirmationMessage:
          'Bring your product link, current funnel numbers, and the decision you are trying to make.',
        cancellationPolicy:
          'Reschedule up to 24 hours before the session. No-shows are not refundable.',
        connectedCalendars: [
          {
            id: 'calendar-google-primary',
            provider: 'GOOGLE',
            expiresAt: daysAgo(-30).toISOString(),
          },
        ],
      },
    },
    {
      type: 'CONSULTATION',
      id: 'consultation-community-setup-draft',
      name: 'Community Setup Jam',
      description:
        'Draft service for helping creators shape a membership onboarding and engagement rhythm.',
      status: 'DRAFT',
      price: 180,
      userId: 'mocked-user-id',
      createdAt: daysAgo(9),
      updatedAt: daysAgo(9),
      consultationDetails: {
        durationMinutes: 60,
        meetingMethod: 'GOOGLE_MEET',
        bufferBeforeMinutes: 10,
        bufferAfterMinutes: 10,
        confirmationMessage: '',
      },
    },
    {
      type: 'MEMBERSHIP',
      id: 'membership-studio-pass',
      name: 'Creator Studio Pass',
      description:
        'Monthly access to workshops, private critiques, templates, and behind-the-scenes build notes.',
      status: 'PUBLISHED',
      price: 29,
      userId: 'mocked-user-id',
      createdAt: daysAgo(60),
      updatedAt: daysAgo(3),
      imageUrl:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    },
    {
      type: 'MEMBERSHIP',
      id: 'membership-founders-circle-draft',
      name: 'Founders Circle',
      description:
        'Early draft for a higher-touch membership tier with small group sessions and launch reviews.',
      status: 'DRAFT',
      price: 99,
      userId: 'mocked-user-id',
      createdAt: daysAgo(2),
      updatedAt: daysAgo(1),
    },
  ];

  const creatorProfiles: Record<
    string,
    { createdByName: string; createdByTitle: string }
  > = {
    'mocked-user-id': {
      createdByName: 'Aleb Mocked',
      createdByTitle: 'Creator Product Strategist',
    },
    'mocked-user-id-2': {
      createdByName: 'Tomi Varga',
      createdByTitle: 'Launch Systems Coach',
    },
    'mocked-user-id-3': {
      createdByName: 'Janos Mira',
      createdByTitle: 'Community Builder',
    },
  };

  const publicMockProducts: AbstractProduct[] = [
    ...mockProducts,
    {
      type: 'COURSE',
      id: 'course-cohort-facilitation',
      name: 'Cohort Facilitation Playbook',
      description:
        'Design week-by-week live learning experiences with prompts, rituals, and feedback loops.',
      status: 'PUBLISHED',
      price: 199,
      userId: 'mocked-user-id-2',
      createdAt: daysAgo(31),
      updatedAt: daysAgo(7),
      imageUrl:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      sections: [
        {
          id: 'course-cohort-facilitation-section-1',
          productId: 'course-cohort-facilitation',
          title: 'Plan the Cohort',
          description: 'Set outcomes, milestones, and live session formats.',
          position: 1,
          lessons: [
            {
              id: 'course-cohort-facilitation-lesson-1',
              productId: 'course-cohort-facilitation',
              sectionId: 'course-cohort-facilitation-section-1',
              title: 'Weekly arc design',
              type: 'VIDEO',
              description: 'Make each week feel purposeful and complete.',
              content: 'Draft a week-by-week arc with one transformation per week.',
              videoUrl: 'https://cdn.example.com/cohort-playbook/weekly-arc.mp4',
              position: 1,
            },
          ],
        },
      ],
    },
    {
      type: 'DOWNLOAD',
      id: 'download-community-prompts',
      name: 'Community Prompt Library',
      description:
        'A searchable pack of onboarding, reflection, accountability, and reactivation prompts.',
      status: 'PUBLISHED',
      price: 24,
      userId: 'mocked-user-id-3',
      createdAt: daysAgo(14),
      updatedAt: daysAgo(8),
      imageUrl:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
      sections: [
        {
          id: 'download-community-prompts-section-1',
          productId: 'download-community-prompts',
          title: 'Prompt Files',
          description: 'CSV and Notion-ready community prompts.',
          position: 1,
          files: [
            {
              id: 'download-community-prompts-file-1',
              fileName: 'community-prompts.csv',
              fileType: 'text/csv',
              size: 125000,
              url: 'https://cdn.example.com/community-prompts/prompts.csv',
            },
          ],
        },
      ],
    },
  ];

  const toProductMinimised = (product: AbstractProduct): ProductMinimised => {
    const creator = creatorProfiles[product.userId ?? 'mocked-user-id'];

    return {
      id: product.id,
      title: product.name,
      description: product.description,
      type: product.type,
      price: product.price,
      status: product.status,
      imageUrl: product.imageUrl,
      createdById: product.userId,
      createdByName: creator?.createdByName ?? 'Mock Creator',
      createdByTitle: creator?.createdByTitle ?? 'Digital Product Creator',
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  };

  const withApiDetails = (product: AbstractProduct) => ({
    ...product,
    title: product.name,
    details:
      product.type === 'COURSE' || product.type === 'DOWNLOAD'
        ? { sections: product.sections ?? [] }
        : product.type === 'CONSULTATION'
          ? product.consultationDetails ?? null
          : null,
  });

  const getProductById = (productId: string | null | undefined) =>
    publicMockProducts.find((product) => product.id === productId);

  const getProductsByUser = (userId: string | null) =>
    mockProducts.filter((product) => !userId || product.userId === userId);

  const toSimplePage = <T,>(content: T[], page: number, size: number) => {
    const start = page * size;
    const pageContent = content.slice(start, start + size);
    const totalElements = content.length;
    const totalPages = Math.ceil(totalElements / size);

    return {
      content: pageContent,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page + 1 >= totalPages,
      empty: pageContent.length === 0,
    };
  };

  /* ------------------USER-----------------------------------*/
  mock.onGet('api/user/userInfo').reply(200, mockedUser);

  mock.onPut('api/user/dev/role').reply((config) => {
    const { role } = JSON.parse(config.data) as { role?: UserRole };

    if (!role || !Object.values(UserRole).includes(role)) {
      return [400, { message: 'Invalid role' }];
    }

    mockedUser.roles = [role];
    console.info('[MOCK] dev user role changed:', role);

    return [200, mockedUser];
  });

  /* ------------------AUTH-----------------------------------*/
  mock.onPost('api/auth/login').reply((config) => {
    const { email, password } = JSON.parse(config.data);
    console.info('[MOCK] login attempt:', { email, password });

    return [200, 'SUCCESS'];
  });

  /* ------------------ADMIN PRODUCTS----------------------------*/
  mock.onGet(new RegExp('^api/admin/products.*')).reply((config) => {
    const url = new URL(config.url!, 'http://localhost');
    const search = url.searchParams.get('search')?.trim().toLowerCase() ?? '';
    const ownerId = url.searchParams.get('ownerId') ?? '';
    const type = url.searchParams.get('type') ?? '';
    const status = url.searchParams.get('status') ?? '';
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');

    const filtered = publicMockProducts
      .map(toProductMinimised)
      .filter((product) => {
        const matchesSearch =
          !search ||
          [product.title, product.description, product.createdByName]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(search));
        const matchesOwner = !ownerId || product.createdById === ownerId;
        const matchesType = !type || product.type === type;
        const matchesStatus = !status || product.status === status;

        return matchesSearch && matchesOwner && matchesType && matchesStatus;
      });

    return [200, toSimplePage(filtered, page, size)];
  });

  /* ------------------PRODUCTS-----------------------------------*/
  mock.onPost('api/products').reply((config) => {
    const productData = JSON.parse(config.data);
    console.info('[MOCK] product creation:', productData);

    const isSectionBased =
      productData.type === 'COURSE' || productData.type === 'DOWNLOAD';
    const seededSections =
      productData.type === 'COURSE'
        ? [
            {
              id: 'section-1-id-mocked',
              title: 'Draft',
              description: '',
              position: 1,
              lessons: [],
            },
          ]
        : [];

    const response = {
      id: 'mocked-product-id',
      price: 'free',
      ...productData,
      details:
        productData.type === 'CONSULTATION'
          ? productData.details ?? null
          : isSectionBased
            ? { sections: seededSections }
            : null,
    };
    return [200, response];
  });

  mock.onPatch(new RegExp('^api/products/[^/]+$')).reply((config) => {
    const productData = JSON.parse(config.data) as AbstractProduct;
    console.info('[MOCK] product update:', productData);

    return [200, productData];
  });

  mock
    .onGet(new RegExp('^api/products\\?ownerId=.*'))
    .reply(() => [200, getProductsByUser('mocked-user-id').map(toProductMinimised)]);

  mock.onGet(new RegExp('^api/products/[^/]+$')).reply((config) => {
    const productId = config.url?.split('/').pop();
    const product = getProductById(productId);

    if (!product) {
      return [404, { message: 'Product not found' }];
    }

    return [200, withApiDetails(product)];
  });

  mock.onPost(new RegExp('^api/products/[^/]+/sections$')).reply((config) => {
    const sectionData = JSON.parse(config.data);
    const productId = config.url?.split('/')[2];

    return [
      200,
      {
        id: `mocked-section-id-${sectionData.position ?? 0}`,
        productId,
        title: sectionData.title,
        description: sectionData.description,
        position: sectionData.position ?? 0,
        lessons: [],
        files: [],
      },
    ];
  });

  mock
    .onPatch(new RegExp('^api/products/[^/]+/sections/[^/]+$'))
    .reply((config) => {
      const sectionData = JSON.parse(config.data) as ProductSectionUpdateRequest;
      const parts = config.url?.split('/') ?? [];
      const productId = parts[2];
      const sectionId = parts[4];

      return [
        200,
        {
          id: sectionId,
          productId,
          title: sectionData.title ?? 'Updated section',
          description: sectionData.description ?? '',
          position: sectionData.position ?? 0,
          lessons: [],
          files: [],
        },
      ];
    });

  mock.onDelete(new RegExp('^api/products/[^/]+/sections/[^/]+$')).reply(204);

  mock
    .onPost(new RegExp('^api/products/[^/]+/sections/[^/]+/lessons$'))
    .reply((config) => {
      const lessonData = JSON.parse(config.data);
      const parts = config.url?.split('/') ?? [];
      const productId = parts[2];
      const sectionId = parts[4];

      return [
        200,
        {
          id: `mocked-lesson-id-${lessonData.position ?? 0}`,
          productId,
          sectionId,
          ...lessonData,
        },
      ];
    });

  mock
    .onPatch(new RegExp('^api/products/[^/]+/sections/[^/]+/lessons/[^/]+$'))
    .reply((config) => {
      const lessonData = JSON.parse(config.data);
      const parts = config.url?.split('/') ?? [];
      const productId = parts[2];
      const sectionId = parts[4];
      const lessonId = parts[6];

      return [
        200,
        {
          id: lessonId,
          productId,
          sectionId,
          ...lessonData,
        },
      ];
    });

  mock
    .onDelete(new RegExp('^api/products/[^/]+/sections/[^/]+/lessons/[^/]+$'))
    .reply(204);

  mock
    .onGet(new RegExp('^/api/products/[^/]+/sections/[^/]+/files/presigned-url.*'))
    .reply((config) => {
      const url = new URL(config.url!, 'http://localhost');
      const filename = url.searchParams.get('filename');

      return [
        200,
        {
          fileId: 'mocked-file-id-2',
          presignedUrl: 'https://upload.example.com/presigned',
          key: `uploads/${filename}`,
          fileUrl: `https://cdn.example.com/${filename}`,
        },
      ];
    });

  mock
    .onPost(new RegExp('^/api/products/[^/]+/sections/[^/]+/files/confirm-upload$'))
    .reply((config) => {
      const payload = JSON.parse(config.data);

      return [
        201,
        {
          fileId: 'mocked-file-id-2',
          fileName: payload.fileName,
          url: payload.fileUrl,
        },
      ];
    });

  mock
    .onDelete(new RegExp('^/api/products/[^/]+/sections/[^/]+/files/[^/]+$'))
    .reply(204);

  mock.onPost('api/products/course/section').reply((config) => {
    const sectionData = JSON.parse(config.data);
    console.info('[MOCK] section creation:', sectionData);

    const response = {
      id: `mocked-session-id-${sectionData.position}`,
      ...sectionData,
    };
    return [200, response];
  });

  mock.onPut('api/products/course/section').reply((config) => {
    const sectionData = JSON.parse(config.data) as ProductSectionUpdateRequest;
    console.info('[MOCK] section update:', sectionData);
    return [200, 'Done'];
  });

  mock.onPost('api/products/course/section/lesson').reply((config) => {
    const lessonData = JSON.parse(config.data);
    console.info('[MOCK] lesson creation:', lessonData);

    const response = {
      id: `mocked-lesson-id-${lessonData.position}`,
      ...lessonData,
    };
    return [200, response];
  });

  mock.onPut('api/products/course/section/lesson').reply((config) => {
    const lessonData = JSON.parse(config.data);
    console.info('[MOCK] lesson update:', lessonData);
    return [200, 'Done'];
  });

  mock.onGet('api/products?userId=mocked-user-id').reply(() => {
    const resp = getProductsByUser('mocked-user-id').map(withApiDetails);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, resp]);
      }, 1500); // 1.5s delay
    });
  });

  mock.onGet(new RegExp('api/products?userId=.*')).reply((config) => {
    const url = new URL(config.url!, 'http://localhost'); // Base required for URL parsing
    const userId = url.searchParams.get('userId');
    console.info('[MOCK] get products by user id request:', userId);

    return [200, getProductsByUser(userId).map(withApiDetails)];
  });

  mock.onGet(new RegExp('api/products/getProduct.*')).reply((config) => {
    const url = new URL(config.url!, 'http://localhost'); // Base required for URL parsing
    const productId = url.searchParams.get('productId');
    const type = url.searchParams.get('type');

    console.info('[MOCK] getProduct request:', { productId, type });

    const product = publicMockProducts.find(
      (p) => p.id === productId && p.type === type,
    );

    if (product) {
      return [200, withApiDetails(product)];
    } else {
      return [404, { message: 'Product not found' }];
    }
  });

  // Mock the search endpoint
  mock.onGet(new RegExp('/api/products/search.*')).reply((config) => {
    // Parse query params
    const url = new URL(config.url!, 'http://localhost');
    const term = url.searchParams.get('term') || '';
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    const sort = url.searchParams.get('sort') || 'createdAt,desc';

    console.info('[MOCK] search for:', { term, page, size, sort });

    const normalisedTerm = term.trim().toLowerCase();
    const filtered = publicMockProducts
      .map(toProductMinimised)
      .filter((product) => {
        if (!normalisedTerm) {
          return product.status === 'PUBLISHED';
        }

        return [
          product.title,
          product.description,
          product.type,
          product.createdByName,
          product.createdByTitle,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalisedTerm));
      });

    const start = page * size;
    const all = filtered.slice(start, start + size);
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);

    const response: SearchResponse<ProductMinimised> = {
      content: all,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: { empty: false, sorted: true, unsorted: false },
        offset: page * size,
        paged: true,
        unpaged: false,
      },
      last: page + 1 >= totalPages,
      totalPages,
      totalElements,
      first: page === 0,
      size,
      number: page,
      sort: { empty: false, sorted: true, unsorted: false },
      numberOfElements: all.length,
      empty: all.length === 0,
    };

    return [200, response];
  });

  // getAllProductsMinimalAPI
  mock
    .onGet('api/products/get-all-products-min')
    .reply(200, publicMockProducts.map(toProductMinimised));

  // --------------------- CALENDAR --------------------------

  mock
    .onGet('api/calendars/providers')
    .reply(200, { providers: ['GOOGLE', 'MICROSOFT', 'ICLOUD'] });

  /* ------------------REVIEWS-----------------------------------*/
  mock.onGet(new RegExp('/api/creators/reviews.*')).reply((config) => {
    const url = new URL(config.url!, 'http://localhost');
    const productId = url.searchParams.get('productId') || '';
    const rating = url.searchParams.get('rating') || '';
    const status = url.searchParams.get('status') || ''; // "visible" | "hidden"
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '10');

    console.info('[MOCK] get reviews:', {
      productId,
      rating,
      status,
      search,
      page,
      size,
    });

    const PRODUCTS = publicMockProducts
      .filter((product) => product.status === 'PUBLISHED')
      .map((product) => ({
        id: product.id,
        name: product.name,
        type: product.type,
      }));

    const USER_FIRSTNAMES = [
      'Michael',
      'Julia',
      'Jor-El',
      'Enrique',
      'Mary-Jane',
      'Pablo',
      'Ascupilius',
      'Vladislavovich',
      'Bob',
    ];

    const USER_LASTNAMES = [
      'Herculeanus',
      'Hendricks',
      'de la Vega',
      'de la Săpânța',
      'Ni-hao',
      'Goldstein',
      'Jackson',
      'Janitor',
      'Bobber',
      'Croft',
      'Crocobaur',
      'Diskotec',
    ];

    const SAMPLE_COMMENTS = [
      // eslint-disable-next-line quotes
      "Amazing course! Very detailed. If I hadn't lorem ipsumed, dolor sit amet in places. So thank you!",
      'Not bad, could use more structure.',
      'Did not enjoy this one.',
      'Perfect! Exactly what I needed.',
      // eslint-disable-next-line max-len
      'Great value for the money. 10 out of 10 would buy again. I tried exorcisamus te omnis immundus spiritus, but omnica postestas against me, so I know not what I dodo.',
      'A bit too fast-paced for beginners.',
      'Content was outdated.',
      'Loved the examples!',
      'Tutor explains everything clearly.',
      'Would recommend to a friend.',
    ];

    const SAMPLE_REPLIES = [
      'Thank you! Happy it helped!',
      'Appreciate the feedback!',
      // eslint-disable-next-line quotes
      "We'll improve this soon!",
      'Glad you enjoyed it! I had hoped someone would cry at my comedy, and you did. How marvelous.',
      'Thanks for taking the time to review!',
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const randomFrom = (arr: any[]) =>
      arr[Math.floor(Math.random() * arr.length)];
    const randomBool = (p = 0.5) => Math.random() < p;

    // ---------- Start with a few crafted reviews ----------
    const BASE_REVIEWS = [
      {
        id: 'r_manual_1',
        product: {
          id: 'course-video-sprint',
          name: 'Video Sales Page Sprint',
          type: 'COURSE',
        },
        customer: {
          id: 'cust_manual_1',
          name: 'Cust Manuel',
          email: 'cust.manuel@example.com',
        },
        rating: 5,
        comment: 'This course changed my life!',
        hidden: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reply: {
          authorId: 'mocked-user-id',
          comment: 'Thank you 🙏',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        id: 'r_manual_2',
        product: {
          id: 'download-launch-asset-vault',
          name: 'Launch Asset Vault',
          type: 'DOWNLOAD',
        },
        customer: {
          id: 'cust_manual_1',
          name: 'Cust Manuel',
          email: 'cust.manuel@example.com',
        },
        rating: 3,
        comment: 'Okay resource, but missing templates.',
        hidden: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reply: null,
      },
    ];

    // ---------- Auto-generate ~40 reviews ----------
    const GENERATED_REVIEWS = Array.from({ length: 38 }).map((_, i) => {
      const hasReply = randomBool(0.35); // ~35% have replies
      const isHidden = randomBool(0.2); // ~20% hidden reviews

      const prod = randomFrom(PRODUCTS);
      const userFirstName = randomFrom(USER_FIRSTNAMES);
      const userLastName = randomFrom(USER_LASTNAMES);

      const lastNameForEmail = userLastName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
      const email = `${userFirstName.toLowerCase()}.${lastNameForEmail}@example.com`;

      return {
        id: `r_auto_${i}`,
        product: {
          id: prod.id,
          name: prod.name,
          type: prod.type,
        },
        customer: {
          id: `cust_${i}`,
          name: `${userFirstName} ${userLastName}`,
          email,
        },
        rating: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5,
        comment: randomFrom(SAMPLE_COMMENTS),
        hidden: isHidden,
        createdAt: new Date(
          Date.now() - Math.random() * 100000000,
        ).toISOString(),
        updatedAt: new Date().toISOString(),
        reply: hasReply
          ? {
              authorId: 'mocked-user-id',
              comment: randomFrom(SAMPLE_REPLIES),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : null,
      };
    });

    // ---- FILTERING ----
    let filtered = [...BASE_REVIEWS, ...GENERATED_REVIEWS];
    console.log('filtered1', filtered);

    if (productId) {
      filtered = filtered.filter((r) => r.product.id === productId);
    }
    console.log('filtered2', filtered);
    if (rating) {
      filtered = filtered.filter((r) => r.rating === Number(rating));
    }
    console.log('filtered3', filtered);
    if (status === 'visible') {
      filtered = filtered.filter((r) => !r.hidden);
    } else if (status === 'hidden') {
      filtered = filtered.filter((r) => r.hidden);
    }
    console.log('filtered4', filtered);
    if (search) {
      filtered = filtered.filter((r) =>
        (r.comment || '').toLowerCase().includes(search),
      );
    }

    console.log('filtered', filtered);

    // ---- PAGINATION ----
    const start = page * size;
    const end = start + size;
    const paginated = filtered.slice(start, end);

    console.log('pag', paginated);

    const response = {
      items: paginated,
      total: filtered.length,
      page,
      pageSize: size,
    };

    return [200, response];
  });
}
