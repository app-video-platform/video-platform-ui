import {
  CreatorCustomer,
  CreatorCustomersDataState,
} from './creator-customers.types';

const productGrowth = {
  id: 'prod-course-growth',
  name: 'Creator Product Growth System',
  type: 'Course' as const,
};
const membershipLab = {
  id: 'prod-membership-lab',
  name: 'Creator Systems Lab membership',
  type: 'Membership' as const,
};
const launchToolkit = {
  id: 'prod-download-toolkit',
  name: 'Launch Toolkit',
  type: 'Download' as const,
};
const offerAudit = {
  id: 'prod-consultation-audit',
  name: 'Offer audit consultation',
  type: 'Consultation' as const,
};

export const creatorCustomersInspectionFixture: CreatorCustomer[] = [
  {
    id: 'cust-maya-johnson',
    name: 'Maya Johnson',
    email: 'maya.johnson@example.test',
    phone: '+353 85 555 0104',
    location: 'Dublin, Ireland',
    language: 'English',
    timezone: 'Europe/Dublin',
    customerSince: '2026-02-18T10:00:00.000Z',
    relationshipStatus: 'active-member',
    membershipState: 'active',
    products: [membershipLab, productGrowth, launchToolkit],
    totalSpendCents: 124900,
    ordersCount: 7,
    activeAccessCount: 3,
    lastActivityAt: '2026-08-11T13:20:00.000Z',
    lastActivityLabel: '2h ago',
    tags: ['Founding member', 'Cohort lead'],
    activity: [
      {
        id: 'act-maya-renewed',
        label: 'Membership renewed',
        context: 'Creator Systems Lab membership',
        occurredAt: '2026-08-11T13:20:00.000Z',
      },
      {
        id: 'act-maya-accessed',
        label: 'Course accessed',
        context: 'Creator Product Growth System',
        occurredAt: '2026-08-10T09:12:00.000Z',
      },
    ],
    purchases: [
      {
        id: 'order-maya-7',
        productName: 'Creator Systems Lab membership',
        productType: 'Membership',
        purchasedAt: '2026-08-11T13:20:00.000Z',
        amountCents: 3900,
        paymentModel: 'Monthly',
        status: 'paid',
      },
      {
        id: 'order-maya-6',
        productName: 'Creator Product Growth System',
        productType: 'Course',
        purchasedAt: '2026-06-04T10:20:00.000Z',
        amountCents: 14900,
        paymentModel: 'One-time',
        status: 'paid',
      },
    ],
    access: [
      {
        id: 'access-maya-lab',
        productName: 'Creator Systems Lab membership',
        productType: 'Membership',
        status: 'active',
        source: 'membership',
        grantedAt: '2026-02-18T10:00:00.000Z',
      },
      {
        id: 'access-maya-course',
        productName: 'Creator Product Growth System',
        productType: 'Course',
        status: 'active',
        source: 'purchased',
        grantedAt: '2026-06-04T10:20:00.000Z',
      },
      {
        id: 'access-maya-toolkit',
        productName: 'Launch Toolkit',
        productType: 'Download',
        status: 'active',
        source: 'manual',
        grantedAt: '2026-07-15T09:00:00.000Z',
      },
    ],
    notes: [
      {
        id: 'note-maya-1',
        author: 'Maya Rivera',
        createdAt: '2026-08-01T10:30:00.000Z',
        body: 'Prefers launch planning examples from solo-creator businesses.',
      },
    ],
  },
  {
    id: 'cust-mira-patel',
    name: 'Mira Patel',
    email: 'mira.patel@example.test',
    location: 'Lisbon, Portugal',
    language: 'English',
    timezone: 'Europe/Lisbon',
    customerSince: '2026-03-12T11:40:00.000Z',
    relationshipStatus: 'past-due',
    membershipState: 'past_due',
    products: [membershipLab, offerAudit],
    totalSpendCents: 71400,
    ordersCount: 5,
    activeAccessCount: 1,
    lastActivityAt: '2026-08-11T08:10:00.000Z',
    lastActivityLabel: '7h ago',
    tags: ['Payment attention'],
    activity: [
      {
        id: 'act-mira-failed',
        label: 'Payment failed',
        context: 'Creator Systems Lab membership',
        occurredAt: '2026-08-11T08:10:00.000Z',
      },
    ],
    purchases: [
      {
        id: 'order-mira-5',
        productName: 'Creator Systems Lab membership',
        productType: 'Membership',
        purchasedAt: '2026-08-11T08:10:00.000Z',
        amountCents: 3900,
        paymentModel: 'Monthly',
        status: 'failed',
      },
      {
        id: 'order-mira-4',
        productName: 'Offer audit consultation',
        productType: 'Consultation',
        purchasedAt: '2026-05-02T12:00:00.000Z',
        amountCents: 32500,
        paymentModel: 'One-time',
        status: 'paid',
      },
    ],
    access: [
      {
        id: 'access-mira-lab',
        productName: 'Creator Systems Lab membership',
        productType: 'Membership',
        status: 'active',
        source: 'membership',
        grantedAt: '2026-03-12T11:40:00.000Z',
        expiresAt: '2026-08-18T11:40:00.000Z',
      },
    ],
    notes: [],
  },
  {
    id: 'cust-jules-carter',
    name: 'Jules Carter',
    email: 'jules.carter@example.test',
    location: 'London, United Kingdom',
    language: 'English',
    timezone: 'Europe/London',
    customerSince: '2026-07-29T14:00:00.000Z',
    relationshipStatus: 'active-member',
    membershipState: 'active',
    products: [membershipLab],
    totalSpendCents: 3900,
    ordersCount: 1,
    activeAccessCount: 1,
    lastActivityAt: '2026-08-10T15:10:00.000Z',
    lastActivityLabel: '1 day ago',
    activity: [
      {
        id: 'act-jules-started',
        label: 'Membership started',
        context: 'Creator Systems Lab membership',
        occurredAt: '2026-07-29T14:00:00.000Z',
      },
    ],
    purchases: [
      {
        id: 'order-jules-1',
        productName: 'Creator Systems Lab membership',
        productType: 'Membership',
        purchasedAt: '2026-07-29T14:00:00.000Z',
        amountCents: 3900,
        paymentModel: 'Monthly',
        status: 'paid',
      },
    ],
    access: [
      {
        id: 'access-jules-lab',
        productName: 'Creator Systems Lab membership',
        productType: 'Membership',
        status: 'active',
        source: 'membership',
        grantedAt: '2026-07-29T14:00:00.000Z',
      },
    ],
  },
  {
    id: 'cust-noah-kim',
    name: 'Noah Kim',
    email: 'noah.kim@example.test',
    location: 'Berlin, Germany',
    timezone: 'Europe/Berlin',
    customerSince: '2026-01-09T09:15:00.000Z',
    relationshipStatus: 'buyer',
    membershipState: 'cancelled',
    products: [productGrowth, launchToolkit],
    totalSpendCents: 29800,
    ordersCount: 2,
    activeAccessCount: 2,
    lastActivityAt: '2026-08-07T16:20:00.000Z',
    lastActivityLabel: 'Aug 7',
    activity: [
      {
        id: 'act-noah-cancelled',
        label: 'Membership cancelled',
        context: 'Creator Systems Lab membership',
        occurredAt: '2026-08-07T16:20:00.000Z',
      },
    ],
    purchases: [
      {
        id: 'order-noah-2',
        productName: 'Launch Toolkit',
        productType: 'Download',
        purchasedAt: '2026-04-11T12:00:00.000Z',
        amountCents: 14900,
        paymentModel: 'One-time',
        status: 'paid',
      },
      {
        id: 'order-noah-1',
        productName: 'Creator Product Growth System',
        productType: 'Course',
        purchasedAt: '2026-01-09T09:15:00.000Z',
        amountCents: 14900,
        paymentModel: 'One-time',
        status: 'paid',
      },
    ],
    access: [
      {
        id: 'access-noah-course',
        productName: 'Creator Product Growth System',
        productType: 'Course',
        status: 'active',
        source: 'purchased',
        grantedAt: '2026-01-09T09:15:00.000Z',
      },
      {
        id: 'access-noah-toolkit',
        productName: 'Launch Toolkit',
        productType: 'Download',
        status: 'active',
        source: 'purchased',
        grantedAt: '2026-04-11T12:00:00.000Z',
      },
    ],
    notes: [
      {
        id: 'note-noah-1',
        author: 'Maya Rivera',
        createdAt: '2026-07-18T09:00:00.000Z',
        body: 'Cancelled membership after finishing the launch module.',
      },
    ],
  },
  {
    id: 'cust-sofia-rossi',
    name: 'Sofia Rossi',
    email: 'sofia.rossi@example.test',
    location: 'Milan, Italy',
    customerSince: '2026-08-05T08:00:00.000Z',
    relationshipStatus: 'buyer',
    membershipState: 'none',
    products: [offerAudit],
    totalSpendCents: 32500,
    ordersCount: 1,
    activeAccessCount: 1,
    lastActivityAt: '2026-08-05T08:00:00.000Z',
    lastActivityLabel: 'Aug 5',
    activity: [
      {
        id: 'act-sofia-booked',
        label: 'Consultation purchased',
        context: 'Offer audit consultation',
        occurredAt: '2026-08-05T08:00:00.000Z',
      },
    ],
    purchases: [
      {
        id: 'order-sofia-1',
        productName: 'Offer audit consultation',
        productType: 'Consultation',
        purchasedAt: '2026-08-05T08:00:00.000Z',
        amountCents: 32500,
        paymentModel: 'One-time',
        status: 'paid',
      },
    ],
    access: [
      {
        id: 'access-sofia-audit',
        productName: 'Offer audit consultation',
        productType: 'Consultation',
        status: 'active',
        source: 'purchased',
        grantedAt: '2026-08-05T08:00:00.000Z',
      },
    ],
  },
  {
    id: 'cust-ari-long',
    name: 'Ari Evangelista Montoya-Singh',
    email: 'ari.evangelista.montoya.singh@example-super-long-domain.test',
    location: 'Toronto, Canada',
    customerSince: '2026-07-20T16:00:00.000Z',
    relationshipStatus: 'buyer',
    membershipState: 'none',
    products: [productGrowth, launchToolkit, offerAudit],
    totalSpendCents: 62300,
    ordersCount: 3,
    activeAccessCount: 3,
    lastActivityAt: '2026-08-01T11:40:00.000Z',
    lastActivityLabel: 'Aug 1',
    activity: [
      {
        id: 'act-ari-download',
        label: 'Resource downloaded',
        context: 'Launch Toolkit',
        occurredAt: '2026-08-01T11:40:00.000Z',
      },
    ],
    purchases: [],
    access: [],
    notes: [],
  },
  {
    id: 'cust-elena-waitlist',
    name: 'Elena Garcia',
    email: 'elena.garcia@example.test',
    location: 'Madrid, Spain',
    relationshipStatus: 'waitlist',
    membershipState: 'none',
    products: [],
    totalSpendCents: 0,
    ordersCount: 0,
    activeAccessCount: 0,
    lastActivityAt: '2026-08-09T10:15:00.000Z',
    lastActivityLabel: '2 days ago',
    tags: ['Waitlist'],
    activity: [
      {
        id: 'act-elena-waitlist',
        label: 'Joined waitlist',
        context: 'Creator Systems Lab membership',
        occurredAt: '2026-08-09T10:15:00.000Z',
      },
    ],
    purchases: [],
    access: [],
    notes: [],
  },
  {
    id: 'cust-email-only',
    email: 'email.only.customer@example.test',
    relationshipStatus: 'waitlist',
    membershipState: 'none',
    products: [],
    totalSpendCents: 0,
    ordersCount: 0,
    activeAccessCount: 0,
    lastActivityAt: '2026-07-22T10:15:00.000Z',
    lastActivityLabel: 'Jul 22',
    activity: [],
    purchases: [],
    access: [],
    notes: [],
  },
];

export const getCreatorCustomersInspectionData =
  (): CreatorCustomersDataState => {
    if (
      typeof window !== 'undefined' &&
      window.localStorage.getItem('creator-customers-empty') === 'true'
    ) {
      return { status: 'ready', customers: [] };
    }

    return { status: 'ready', customers: creatorCustomersInspectionFixture };
  };

export const getCreatorCustomersData = (): CreatorCustomersDataState => {
  if (process.env.REACT_APP_USE_MOCKS === 'true') {
    return getCreatorCustomersInspectionData();
  }

  return { status: 'unavailable', customers: [] };
};
