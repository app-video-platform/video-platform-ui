/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { User, UserRole } from './models/user/user';
import { SearchResponse } from './services/products/products-api';
import { SocialPlatforms } from './models/socials/social-media-link';
import { CourseSectionUpdateRequest } from './models/product/section';
import { ProductMinimised } from './models/product/product';
import { AbstractProduct, ProductType } from './models';

/**
 * Call this once (passing in your axios instance) to wire up all mock endpoints.
 */
export function setupMocks(client: AxiosInstance) {
  const mock = new MockAdapter(client, { delayResponse: 300 });

  /* ------------------USER-----------------------------------*/
  mock.onGet('api/user/userInfo').reply(200, {
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
  } as User);

  /* ------------------AUTH-----------------------------------*/
  mock.onPost('api/auth/login').reply((config) => {
    const { email, password } = JSON.parse(config.data);
    console.info('[MOCK] login attempt:', { email, password });

    return [200, 'SUCCESS'];
  });

  /* ------------------PRODUCTS-----------------------------------*/
  mock.onPost('api/products').reply((config) => {
    const productData = JSON.parse(config.data);
    console.info('[MOCK] product creation:', productData);

    const response = {
      id: 'mocked-product-id',
      price: 'free',
      sections: [
        {
          id: 'section-1-id-mocked',
          title: '',
          description: '',
          position: 1,
        },
      ],
      ...productData,
    };
    return [200, response];
  });

  mock.onPut('api/products').reply((config) => {
    const productData = JSON.parse(config.data) as AbstractProduct;
    console.info('[MOCK] product update:', productData);

    return [200, productData];
  });

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
    const sectionData = JSON.parse(config.data) as CourseSectionUpdateRequest;
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
    const resp = [
      {
        type: 'COURSE' as ProductType,
        id: 'mocked-course-product-id-1',
        name: 'Mocked Course Product 1',
        description: 'This is a mocked course product description.',
        status: 'draft',
        price: 'free',
        userId: 'mocked-user-id',
      },
      {
        type: 'COURSE' as ProductType,
        id: 'mocked-course-product-id-2',
        name: 'Mocked Course Product 2',
        description: 'This is another mocked course product description.',
        status: 'published',
        price: 100,
        userId: 'mocked-user-id',
      },
      {
        type: 'DOWNLOAD' as ProductType,
        id: 'mocked-download-product-id-1',
        name: 'Mocked Download Product 1',
        description: 'This is a mocked download product description.',
        status: 'draft',
        price: 50,
        userId: 'mocked-user-id',
      },
      {
        type: 'DOWNLOAD' as ProductType,
        id: 'mocked-download-product-id-2',
        name: 'Mocked Download Product 2',
        description: 'This is another mocked download product description.',
        status: 'published',
        price: 'free',
        userId: 'mocked-user-id',
      },
      {
        type: 'CONSULTATION' as ProductType,
        id: 'mocked-consultation-product-id-1',
        name: 'Mocked Consultation Product 1',
        description: 'This is a mocked consultation product description.',
        status: 'published',
        price: 89,
        userId: 'mocked-user-id',
      },
    ];
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

    const allProducts = [
      {
        type: 'COURSE' as ProductType,
        id: 'mocked-course-product-id-1',
        name: 'Mocked Course Product 1',
        description: 'This is a mocked course product description.',
        status: 'draft',
        price: 'free',
        userId: 'mocked-user-id',
      },
      {
        type: 'COURSE' as ProductType,
        id: 'mocked-course-product-id-2',
        name: 'Mocked Course Product 2',
        description: 'This is another mocked course product description.',
        status: 'published',
        price: 100,
        userId: 'mocked-user-id',
      },
      {
        type: 'DOWNLOAD' as ProductType,
        id: 'mocked-download-product-id-1',
        name: 'Mocked Download Product 1',
        description: 'This is a mocked download product description.',
        status: 'draft',
        price: 50,
        userId: 'mocked-user-id',
      },
      {
        type: 'DOWNLOAD' as ProductType,
        id: 'mocked-download-product-id-2',
        name: 'Mocked Download Product 2',
        description: 'This is another mocked download product description.',
        status: 'published',
        price: 'free',
        userId: 'mocked-user-id',
      },
    ];

    return [200, allProducts];
  });

  mock.onGet(new RegExp('api/products/getProduct.*')).reply((config) => {
    const url = new URL(config.url!, 'http://localhost'); // Base required for URL parsing
    const productId = url.searchParams.get('productId');
    const type = url.searchParams.get('type');

    console.info('[MOCK] getProduct request:', { productId, type });

    // Simulate looking up from a mock DB
    const allProducts = [
      {
        type: type as ProductType,
        id: productId,
        name: 'Mocked Course Product 1',
        description: 'This is a mocked course product description.',
        status: 'draft',
        price: 'free',
        userId: 'mocked-user-id',
        sections: [
          {
            userId: 'mocked-user-id',
            id: 'mocked-section-id-1',
            title: 'Mocked Section 1',
            description: 'This is a mocked section description.',
            position: 1,
            productId: productId,
            lessons: [
              {
                id: 'mocked-lesson-id-1',
                title: 'Mocked Lesson 1',
                description: 'This is a mocked lesson description.',
                position: 1,
                content: 'This is some mocked content for lesson 1.',
              },
              {
                id: 'mocked-lesson-id-2',
                title: 'Mocked Lesson 2',
                description: 'This is another mocked lesson description.',
                position: 2,
                content: 'This is some mocked content for lesson 2.',
              },
            ],
          } as CourseSectionUpdateRequest,
        ],
      },
      {
        type: 'COURSE' as ProductType,
        id: 'mocked-course-product-id-2',
        name: 'Mocked Course Product 2',
        description: 'This is another mocked course product description.',
        status: 'published',
        price: 100,
        userId: 'mocked-user-id',
      },
      {
        type: 'DOWNLOAD' as ProductType,
        id: 'mocked-download-product-id-1',
        name: 'Mocked Download Product 1',
        description: 'This is a mocked download product description.',
        status: 'draft',
        price: 50,
        userId: 'mocked-user-id',
      },
      {
        type: 'DOWNLOAD' as ProductType,
        id: 'mocked-download-product-id-2',
        name: 'Mocked Download Product 2',
        description: 'This is another mocked download product description.',
        status: 'published',
        price: 'free',
        userId: 'mocked-user-id',
      },
    ];

    const product = allProducts.find(
      (p) => p.id === productId && p.type === type,
    );

    if (product) {
      return [200, product];
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

    // Generate some fake products matching the term
    const all: ProductMinimised[] = Array.from({ length: size }, (_, i) => ({
      id: `mock-${term}-${page * size + i}`,
      name: `${term || 'Product'} ${page * size + i + 1}`,
      type: 'COURSE',
      price: i % 2 === 0 ? 'free' : 9.99,
      createdById: 'mocked-user-id',
      createdByName: 'Mock User',
      createdByTitle: 'Mock Creator',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const totalElements = 100; // pretend there are 100 total
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
  mock.onGet('api/products/get-all-products-min').reply(200, [
    {
      type: 'COURSE' as ProductType,
      id: 'mocked-course-product-id-1',
      name: 'Mocked Course Product 1',
      price: 'free',
      createdById: 'mocked-user-id',
      createdByName: 'Aleb Mocked',
      createdByTitle: 'D to the E.V.I.L',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ProductMinimised,
    {
      type: 'DOWNLOAD' as ProductType,
      id: 'mocked-course-product-id-2',
      name: 'Mocked Download Product 1',
      price: 120,
      createdById: 'mocked-user-id',
      createdByName: 'Aleb Mocked',
      createdByTitle: 'D to the E.V.I.L',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: 'COURSE' as ProductType,
      id: 'mocked-course-product-id-3',
      name: 'Mocked Course Product 2',
      price: 'free',
      createdById: 'mocked-user-id-2',
      createdByName: 'Tomi',
      createdByTitle: 'The Savage',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: 'CONSULTATION' as ProductType,
      id: 'mocked-course-product-id-4',
      name: 'Mocked Consultation Product 1',
      price: 780,
      createdById: 'mocked-user-id-3',
      createdByName: 'Janos',
      createdByTitle: 'The Idjit',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

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

    // ---------- Products available in the mocks ----------
    const PRODUCT_IDS = [
      'mocked-course-product-id-1',
      'mocked-course-product-id-2',
      'mocked-download-product-id-1',
      'mocked-download-product-id-2',
    ];

    const PRODUCTS = [
      {
        id: 'mocked-course-product-id-1',
        name: 'Mocked Course Product 1',
        type: 'COURSE',
      },
      {
        id: 'mocked-course-product-id-2',
        name: 'Mocked Course Product 2',
        type: 'COURSE',
      },
      {
        id: 'mocked-course-product-id-3',
        name: 'Mocked Course Product: The Second Expansion - Part Two',
        type: 'COURSE',
      },
      {
        id: 'mocked-download-product-id-1',
        name: 'Mocked Download Product 1',
        type: 'DOWNLOAD',
      },
      {
        id: 'mocked-download-product-id-2',
        name: 'Mocked Download Product 2',
        type: 'DOWNLOAD',
      },
      {
        id: 'mocked-consultation-product-id-1',
        name: 'Mocked Consultation Product 1',
        type: 'CONSULTATION',
      },
    ];

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
          id: 'mocked-course-product-id-1',
          name: 'Mocked Course Product 1',
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
          id: 'mocked-download-product-id-1',
          name: 'Mocked Download Product 1',
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
