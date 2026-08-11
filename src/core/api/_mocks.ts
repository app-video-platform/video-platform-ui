/* eslint-disable no-console */
import MockAdapter from 'axios-mock-adapter';
import { AxiosInstance } from 'axios';

import {
  AbstractProduct,
  AbstractProductApiResponse,
  CourseLesson,
  ProductMinimised,
  ProductSection,
  Review,
  User,
  UserRole,
} from './models';

const CREATOR_ID = 'creator-inspection-001';
const NOW = '2026-08-10T09:00:00.000Z';

const creatorUser: User = {
  id: CREATOR_ID,
  firstName: 'Alex',
  lastName: 'Bej',
  email: 'alex.bej@example.test',
  roles: [UserRole.CREATOR],
  onboardingCompleted: true,
  title: 'Creator educator and digital product strategist',
  bio: 'Alex helps independent creators package their expertise into courses, downloads, consultations, and membership experiences.',
  taglineMission:
    'Teach clearly. Sell sustainably. Build calmer creator systems.',
  website: 'https://alex-bej.example.test',
  city: 'Barcelona',
  country: 'Spain',
  imageUrl: 'https://picsum.photos/seed/creator-alex/256/256',
  createdAt: new Date('2025-03-12T10:00:00.000Z'),
};

const courseLessons: CourseLesson[] = [
  {
    id: 'lesson-course-1',
    title: 'Welcome and orientation',
    type: 'VIDEO',
    description: 'A short walkthrough of what this course will cover.',
    position: 1,
    productId: 'prod-course-growth',
    sectionId: 'section-course-1',
    videoUrl: 'https://cdn.example.test/videos/orientation.mp4',
  },
  {
    id: 'lesson-course-2',
    title: 'The positioning worksheet for audiences that are still fuzzy',
    type: 'ARTICLE',
    description:
      'A written exercise for turning broad audience ideas into a tighter offer.',
    position: 2,
    productId: 'prod-course-growth',
    sectionId: 'section-course-1',
    content: '<p>Start with the buyer moment, then map objections.</p>',
  },
  {
    id: 'lesson-course-3',
    title: 'Pricing confidence quiz',
    type: 'QUIZ',
    description: 'A quiz that checks whether your offer has pricing evidence.',
    position: 3,
    productId: 'prod-course-growth',
    sectionId: 'section-course-1',
    quiz: {
      passingScore: 80,
      totalScore: 100,
      questions: [
        {
          id: 'question-1',
          title: 'What should anchor the price of a digital product?',
          type: 'multiple_choice_single',
          points: 50,
          position: 1,
          options: [
            {
              id: 'option-1',
              text: 'Customer outcome',
              position: 1,
              isCorrect: true,
            },
            {
              id: 'option-2',
              text: 'File size',
              position: 2,
              isCorrect: false,
            },
          ],
        },
        {
          id: 'question-2',
          title: 'Which signal suggests a draft offer is ready to test?',
          type: 'multiple_choice_single',
          points: 50,
          position: 2,
          options: [
            {
              id: 'option-3',
              text: 'Clear audience pain',
              position: 1,
              isCorrect: true,
            },
            {
              id: 'option-4',
              text: 'A longer sales page',
              position: 2,
              isCorrect: false,
            },
          ],
        },
      ],
    },
  },
  {
    id: 'lesson-course-4',
    title: 'Launch checklist review',
    type: 'VIDEO',
    description:
      'A longer lesson title intentionally used to expose wrapping in lesson cards and builder navigation.',
    position: 1,
    productId: 'prod-course-growth',
    sectionId: 'section-course-2',
    videoUrl: 'https://cdn.example.test/videos/checklist-review.mp4',
  },
  {
    id: 'lesson-course-5',
    title: 'Post-launch retrospective',
    type: 'ARTICLE',
    description:
      'Capture what converted, what confused buyers, and what to improve.',
    position: 2,
    productId: 'prod-course-growth',
    sectionId: 'section-course-2',
    content:
      '<p>Review funnel analytics, questions, refunds, and testimonials.</p>',
  },
];

const courseSections: ProductSection[] = [
  {
    id: 'section-course-1',
    productId: 'prod-course-growth',
    title: 'Module 1: Product positioning foundations',
    description:
      'Define the buyer, the transformation, and the promise before building assets.',
    position: 1,
    lessons: courseLessons.filter(
      (lesson) => lesson.sectionId === 'section-course-1',
    ),
  },
  {
    id: 'section-course-2',
    productId: 'prod-course-growth',
    title: 'Module 2: Launch assets, delivery flow, and follow-up systems',
    description:
      'Plan emails, product pages, checkout promises, and post-launch iteration.',
    position: 2,
    lessons: courseLessons.filter(
      (lesson) => lesson.sectionId === 'section-course-2',
    ),
  },
  {
    id: 'section-course-3',
    productId: 'prod-course-growth',
    title: 'Module 3: Customer support and evergreen maintenance',
    description:
      'A shorter module with no lessons yet to expose empty section handling.',
    position: 3,
    lessons: [],
  },
];

const products: AbstractProduct[] = [
  {
    id: 'prod-course-growth',
    type: 'COURSE',
    name: 'Creator Product Growth System: from messy expertise to a polished offer',
    description:
      'A practical course for creators who need to shape, price, launch, ' +
      'and improve a digital product without turning the business into chaos.',
    status: 'PUBLISHED',
    price: 149,
    userId: CREATOR_ID,
    imageUrl: 'https://picsum.photos/seed/course-growth/640/360',
    createdAt: new Date('2026-05-04T12:00:00.000Z'),
    updatedAt: new Date('2026-08-01T15:45:00.000Z'),
    sections: courseSections,
  },
  {
    id: 'prod-download-toolkit',
    type: 'DOWNLOAD',
    name: 'Launch Toolkit: swipe files, buyer interview scripts, and checklist templates',
    description:
      'A downloadable pack of worksheets, Notion templates, email snippets, and launch checklists.',
    status: 'DRAFT',
    price: 29,
    userId: CREATOR_ID,
    createdAt: new Date('2026-06-10T10:30:00.000Z'),
    updatedAt: new Date('2026-07-28T11:20:00.000Z'),
    sections: [
      {
        id: 'section-download-1',
        productId: 'prod-download-toolkit',
        title: 'Planning files',
        description: 'Editable templates and worksheets for product planning.',
        position: 1,
        files: [
          {
            id: 'file-1',
            fileName: 'offer-positioning-worksheet.pdf',
            fileType: 'application/pdf',
            size: 820000,
            url: 'https://cdn.example.test/files/offer-positioning-worksheet.pdf',
          },
          {
            id: 'file-2',
            fileName: 'launch-email-swipe-pack.zip',
            fileType: 'application/zip',
            size: 2480000,
            url: 'https://cdn.example.test/files/launch-email-swipe-pack.zip',
          },
        ],
      },
    ],
  },
  {
    id: 'prod-consultation-audit',
    type: 'CONSULTATION',
    name: 'Offer audit consultation',
    description:
      'A focused 1:1 session to review your offer, product page, pricing, and next launch experiment.',
    status: 'PUBLISHED',
    price: 250,
    userId: CREATOR_ID,
    imageUrl: 'https://picsum.photos/seed/consultation-audit/640/360',
    createdAt: new Date('2026-04-18T09:15:00.000Z'),
    updatedAt: new Date('2026-07-18T16:10:00.000Z'),
    consultationDetails: {
      durationMinutes: 50,
      meetingMethod: 'ZOOM',
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 10,
      maxSessionsPerDay: 4,
      confirmationMessage:
        'Thanks for booking. Bring your product page, pricing notes, and one thing that feels stuck.',
      cancellationPolicy: 'FULL_24H',
      connectedCalendars: [],
    },
  },
  {
    id: 'prod-membership-lab',
    type: 'MEMBERSHIP',
    name: 'Creator Systems Lab membership',
    description:
      'A monthly membership with tactical posts, office-hours recordings, resources, and included product access.',
    status: 'DRAFT',
    price: 39,
    userId: CREATOR_ID,
    imageUrl: 'https://picsum.photos/seed/membership-lab/640/360',
    createdAt: new Date('2026-07-01T08:00:00.000Z'),
    updatedAt: new Date('2026-08-08T14:35:00.000Z'),
  },
  {
    id: 'prod-freebie-calendar',
    type: 'DOWNLOAD',
    name: 'Free creator content calendar',
    description:
      'A free planning sheet with prompts for weekly creator updates.',
    status: 'PUBLISHED',
    price: 'free',
    userId: CREATOR_ID,
    createdAt: new Date('2026-03-21T08:00:00.000Z'),
    updatedAt: new Date('2026-07-05T08:00:00.000Z'),
    sections: [
      {
        id: 'section-freebie-1',
        productId: 'prod-freebie-calendar',
        title: 'Calendar download',
        description: 'Spreadsheet and PDF versions.',
        position: 1,
        files: [
          {
            id: 'file-3',
            fileName: 'creator-content-calendar.xlsx',
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: 310000,
          },
        ],
      },
    ],
  },
  {
    id: 'prod-mini-course',
    type: 'COURSE',
    name: 'Tiny email course',
    description:
      'A compact course with a deliberately short title and sparse metadata.',
    status: 'HIDDEN',
    price: 'free',
    userId: CREATOR_ID,
    createdAt: new Date('2026-02-14T08:00:00.000Z'),
    updatedAt: new Date('2026-02-20T08:00:00.000Z'),
    sections: [],
  },
];

const reviews: Review[] = [
  {
    id: 'review-1',
    product: {
      id: 'prod-course-growth',
      name: products[0].name,
      type: 'COURSE',
    },
    customer: {
      id: 'customer-1',
      name: 'Nora Ellis',
      email: 'nora@example.test',
    },
    rating: 5,
    comment:
      'The worksheets made it much easier to explain what my product actually does.',
    hidden: false,
    createdAt: '2026-08-02T10:00:00.000Z',
    updatedAt: '2026-08-02T10:00:00.000Z',
    reply: {
      authorId: CREATOR_ID,
      comment: 'So glad the positioning exercises helped.',
      createdAt: '2026-08-03T10:00:00.000Z',
      updatedAt: '2026-08-03T10:00:00.000Z',
    },
  },
  {
    id: 'review-2',
    product: {
      id: 'prod-download-toolkit',
      name: products[1].name,
      type: 'DOWNLOAD',
    },
    customer: {
      id: 'customer-2',
      name: 'Leo Martin',
      email: 'leo@example.test',
    },
    rating: 4,
    comment:
      'Useful templates. I wanted a few more examples for service businesses.',
    hidden: false,
    createdAt: '2026-07-22T13:00:00.000Z',
    updatedAt: '2026-07-22T13:00:00.000Z',
  },
];

const toSummary = (product: AbstractProduct): ProductMinimised => ({
  id: product.id,
  title: product.name,
  description: product.description,
  type: product.type,
  price: product.price,
  status: product.status,
  imageUrl: product.imageUrl,
  createdById: product.userId,
  createdByName: `${creatorUser.firstName} ${creatorUser.lastName}`,
  createdByTitle: creatorUser.title,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const findProduct = (id?: string) =>
  products.find((product) => product.id === id);

export const setupMocks = (httpClient: AxiosInstance) => {
  const mock = new MockAdapter(httpClient, { delayResponse: 250 });

  console.info('[Mocks] using Creator inspection fixtures');

  mock.onGet(/api\/user\/userInfo$/).reply(200, creatorUser);
  mock.onPut(/api\/user\/userInfo$/).reply((config) => {
    const patch = JSON.parse(config.data || '{}');
    Object.assign(creatorUser, patch, {
      id: creatorUser.id,
      roles: creatorUser.roles,
      onboardingCompleted: true,
    });
    return [200, creatorUser];
  });
  mock.onPut(/api\/user\/dev\/role$/).reply((config) => {
    const { role } = JSON.parse(config.data || '{}') as { role?: UserRole };
    creatorUser.roles = role ? [role] : [UserRole.CREATOR];
    return [200, creatorUser];
  });
  mock.onPost(/api\/auth\/login$/).reply(200, 'Login successful');
  mock.onPost(/api\/auth\/logout$/).reply(200);
  mock.onPost(/api\/auth\/refresh$/).reply(200, { token: 'mock-token' });

  mock
    .onGet(/api\/products\/get-all-products-min/)
    .reply(200, products.map(toSummary));
  mock
    .onGet(/api\/products\?(userId|ownerId)=/)
    .reply(200, products.map(toSummary));
  mock.onGet(/api\/products\/search/).reply((config) => {
    const url = new URL(config.url ?? '', 'http://mock.local');
    const term = (url.searchParams.get('term') ?? '').toLowerCase();
    const content = products
      .map(toSummary)
      .filter((product) =>
        `${product.title ?? ''} ${product.description ?? ''}`
          .toLowerCase()
          .includes(term),
      );

    return [
      200,
      {
        content,
        pageable: {
          pageNumber: 0,
          pageSize: 20,
          sort: { empty: false, sorted: true, unsorted: false },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalPages: 1,
        totalElements: content.length,
        first: true,
        size: 20,
        number: 0,
        sort: { empty: false, sorted: true, unsorted: false },
        numberOfElements: content.length,
        empty: content.length === 0,
      },
    ];
  });
  mock.onGet(/api\/products\/[^/]+$/).reply((config) => {
    const id = config.url?.split('/').pop();
    const product = findProduct(id);
    return product ? [200, product as AbstractProductApiResponse] : [404];
  });
  mock.onPost(/api\/products$/).reply((config) => {
    const payload = JSON.parse(config.data || '{}');
    const id = `prod-dev-${payload.type?.toLowerCase() ?? 'product'}-${products.length + 1}`;
    const product: AbstractProduct = {
      id,
      type: payload.type,
      name: payload.name,
      status: 'DRAFT',
      price: 'free',
      userId: payload.userId ?? CREATOR_ID,
      createdAt: new Date(NOW),
      updatedAt: new Date(NOW),
      sections:
        payload.type === 'COURSE' || payload.type === 'DOWNLOAD'
          ? []
          : undefined,
    };
    products.unshift(product);
    return [200, product as AbstractProductApiResponse];
  });
  mock.onPatch(/api\/products\/[^/]+$/).reply((config) => {
    const id = config.url?.split('/').pop();
    const product = findProduct(id);
    if (!product) {
      return [404];
    }

    Object.assign(product, JSON.parse(config.data || '{}'), {
      updatedAt: new Date(NOW),
    });
    return [200, product as AbstractProductApiResponse];
  });

  mock.onPost(/api\/products\/[^/]+\/sections$/).reply((config) => {
    const parts = config.url?.split('/') ?? [];
    const productId = parts[2];
    const product = findProduct(productId);
    if (
      !product ||
      (product.type !== 'COURSE' && product.type !== 'DOWNLOAD')
    ) {
      return [404];
    }
    const payload = JSON.parse(config.data || '{}');
    const section: ProductSection = {
      id: `section-${productId}-${(product.sections?.length ?? 0) + 1}`,
      productId,
      title: payload.title,
      description: payload.description,
      position: payload.position ?? (product.sections?.length ?? 0) + 1,
      lessons: product.type === 'COURSE' ? [] : undefined,
      files: product.type === 'DOWNLOAD' ? [] : undefined,
    };
    product.sections = [...(product.sections ?? []), section];
    return [200, section];
  });
  mock.onPatch(/api\/products\/[^/]+\/sections\/[^/]+$/).reply((config) => {
    const parts = config.url?.split('/') ?? [];
    const product = findProduct(parts[2]);
    const section = product?.sections?.find((item) => item.id === parts[4]);
    if (!section) {
      return [404];
    }
    Object.assign(section, JSON.parse(config.data || '{}'));
    return [200, section];
  });
  mock.onDelete(/api\/products\/[^/]+\/sections\/[^/]+$/).reply((config) => {
    const parts = config.url?.split('/') ?? [];
    const product = findProduct(parts[2]);
    if (product?.sections) {
      product.sections = product.sections.filter(
        (section) => section.id !== parts[4],
      );
    }
    return [200];
  });

  mock
    .onPost(/api\/products\/[^/]+\/sections\/[^/]+\/lessons$/)
    .reply((config) => {
      const parts = config.url?.split('/') ?? [];
      const product = findProduct(parts[2]);
      const section = product?.sections?.find((item) => item.id === parts[4]);
      if (!section) {
        return [404];
      }
      const payload = JSON.parse(config.data || '{}');
      const lesson: CourseLesson = {
        id: `lesson-${section.id}-${(section.lessons?.length ?? 0) + 1}`,
        productId: product?.id,
        sectionId: section.id ?? '',
        title: payload.title,
        type: payload.type,
        description: payload.description ?? '',
        position: payload.position ?? (section.lessons?.length ?? 0) + 1,
      };
      section.lessons = [...(section.lessons ?? []), lesson];
      return [200, lesson];
    });
  mock
    .onPatch(/api\/products\/[^/]+\/sections\/[^/]+\/lessons\/[^/]+$/)
    .reply((config) => {
      const parts = config.url?.split('/') ?? [];
      const product = findProduct(parts[2]);
      const section = product?.sections?.find((item) => item.id === parts[4]);
      const lesson = section?.lessons?.find((item) => item.id === parts[6]);
      if (!lesson) {
        return [404];
      }
      Object.assign(lesson, JSON.parse(config.data || '{}'));
      return [200, lesson];
    });
  mock
    .onDelete(/api\/products\/[^/]+\/sections\/[^/]+\/lessons\/[^/]+$/)
    .reply((config) => {
      const parts = config.url?.split('/') ?? [];
      const product = findProduct(parts[2]);
      const section = product?.sections?.find((item) => item.id === parts[4]);
      if (section?.lessons) {
        section.lessons = section.lessons.filter(
          (lesson) => lesson.id !== parts[6],
        );
      }
      return [200];
    });

  mock.onGet(/api\/calendars\/providers$/).reply(200, {
    providers: ['GOOGLE', 'OUTLOOK'],
  });
  mock.onPost(/api\/calendars\/connect$/).reply(200, {
    authorizationUrl: 'https://example.test/mock-calendar-oauth',
  });

  mock.onGet(/api\/creators\/reviews/).reply(200, {
    items: reviews,
    total: reviews.length,
    page: 0,
    pageSize: 20,
  });

  mock.onAny().passThrough();
};
