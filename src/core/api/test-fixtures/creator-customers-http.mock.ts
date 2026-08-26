import MockAdapter from 'axios-mock-adapter';

import {
  CreatorCustomer,
  CreatorCustomerListItem,
  CreatorCustomersPage,
} from 'core/api/models';

const membershipLab = {
  id: 'prod-membership-lab',
  name: 'Creator Systems Lab membership',
  type: 'Membership' as const,
};
const productGrowth = {
  id: 'prod-course-growth',
  name: 'Creator Product Growth System',
  type: 'Course' as const,
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

const customers: CreatorCustomer[] = [
  {
    id: 'cust-maya-johnson',
    name: 'Maya Johnson',
    email: 'maya.johnson@example.test',
    relationshipStatus: 'active-member',
    membershipState: 'active',
    products: [membershipLab, productGrowth, launchToolkit],
    totalSpendCents: 124900,
    ordersCount: 7,
    activeAccessCount: 3,
    lastActivityAt: '2026-08-11T13:20:00.000Z',
    lastActivityLabel: '2h ago',
    tags: ['Founding member'],
    activity: [],
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
    ],
    access: [
      {
        id: 'access-maya-toolkit',
        productName: 'Launch Toolkit',
        productType: 'Download',
        status: 'active',
        source: 'manual',
        grantedAt: '2026-07-15T09:00:00.000Z',
      },
      {
        id: 'access-maya-product-growth',
        productName: 'Creator Product Growth System',
        productType: 'Course',
        status: 'active',
        source: 'free',
        grantedAt: '2026-08-10T14:32:00.000Z',
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
    relationshipStatus: 'past-due',
    membershipState: 'past_due',
    products: [membershipLab, offerAudit],
    totalSpendCents: 71400,
    ordersCount: 5,
    activeAccessCount: 1,
    lastActivityAt: '2026-08-11T08:10:00.000Z',
    lastActivityLabel: '7h ago',
    activity: [],
    purchases: [],
    access: [],
    notes: [],
  },
  {
    id: 'cust-noah-kim',
    name: 'Noah Kim',
    email: 'noah.kim@example.test',
    relationshipStatus: 'buyer',
    membershipState: 'cancelled',
    products: [productGrowth, launchToolkit],
    totalSpendCents: 29800,
    ordersCount: 2,
    activeAccessCount: 2,
    lastActivityAt: '2026-08-07T16:20:00.000Z',
    activity: [],
    purchases: [],
    access: [],
  },
  {
    id: 'cust-elena-garcia',
    name: 'Elena Garcia',
    email: 'elena.garcia@example.test',
    relationshipStatus: 'waitlist',
    membershipState: 'none',
    products: [],
    totalSpendCents: 0,
    ordersCount: 0,
    activeAccessCount: 0,
    lastActivityAt: '2026-08-01T09:00:00.000Z',
    activity: [],
    purchases: [],
    access: [],
  },
  {
    id: 'cust-jules-carter',
    name: 'Jules Carter',
    email: 'jules.carter@example.test',
    relationshipStatus: 'active-member',
    membershipState: 'active',
    products: [membershipLab],
    totalSpendCents: 3900,
    ordersCount: 1,
    activeAccessCount: 1,
    activity: [],
    purchases: [],
    access: [],
  },
  {
    id: 'cust-samira-long',
    name: 'Sabrina Longlastname-With-Company-Identifier',
    email: 'sabrina.long.identity@example.test',
    relationshipStatus: 'buyer',
    membershipState: 'none',
    products: [launchToolkit],
    totalSpendCents: 9900,
    ordersCount: 1,
    activeAccessCount: 1,
    activity: [],
    purchases: [],
    access: [],
  },
  {
    id: 'cust-alex-rivera',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.test',
    relationshipStatus: 'active-member',
    membershipState: 'active',
    products: [membershipLab],
    totalSpendCents: 15600,
    ordersCount: 4,
    activeAccessCount: 1,
    activity: [],
    purchases: [],
    access: [],
  },
  {
    id: 'cust-lina-kowalski',
    name: 'Lina Kowalski',
    email: 'lina.kowalski@example.test',
    relationshipStatus: 'buyer',
    membershipState: 'none',
    products: [launchToolkit],
    totalSpendCents: 4900,
    ordersCount: 1,
    activeAccessCount: 1,
    activity: [],
    purchases: [],
    access: [],
  },
];

const productOptions = [membershipLab, productGrowth, launchToolkit, offerAudit];

const listItem = (customer: CreatorCustomer): CreatorCustomerListItem => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  avatarUrl: customer.avatarUrl,
  relationshipStatus: customer.relationshipStatus,
  membershipState: customer.membershipState,
  products: customer.products,
  totalSpendCents: customer.totalSpendCents,
  ordersCount: customer.ordersCount,
  activeAccessCount: customer.activeAccessCount,
  lastActivityAt: customer.lastActivityAt,
  lastActivityLabel: customer.lastActivityLabel,
});

const getParam = (url: string, key: string) =>
  new URL(url, 'http://localhost').searchParams.get(key);

const pageResponse = (
  content: CreatorCustomerListItem[],
  page = 0,
  pageSize = 10,
): CreatorCustomersPage => ({
  content: content.slice(page * pageSize, page * pageSize + pageSize),
  totalElements: content.length,
  totalPages: Math.max(1, Math.ceil(content.length / pageSize)),
  size: pageSize,
  number: page,
  first: page === 0,
  last: page >= Math.ceil(content.length / pageSize) - 1,
  empty: content.length === 0,
  productOptions,
});

export const registerCreatorCustomersTestMocks = (mock: MockAdapter) => {
  mock.onGet(/api\/creator\/customers(?:\?.*)?$/).reply((config) => {
    const url = config.url ?? '';
    const search = getParam(url, 'search')?.toLowerCase() ?? '';
    const status = getParam(url, 'status');
    const product = getParam(url, 'product');
    const membership = getParam(url, 'membership');
    const sort = getParam(url, 'sort');
    const page = Number(getParam(url, 'page') ?? 0);
    const pageSize = Number(getParam(url, 'pageSize') ?? 10);

    let results = customers.filter((customer) => {
      const matchesSearch =
        !search ||
        customer.name?.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search);
      const matchesStatus = !status || customer.relationshipStatus === status;
      const matchesProduct =
        !product || customer.products.some((item) => item.id === product);
      const matchesMembership =
        !membership || customer.membershipState === membership;

      return matchesSearch && matchesStatus && matchesProduct && matchesMembership;
    });

    if (sort === 'spend-asc') {
      results = [...results].sort((a, b) => a.totalSpendCents - b.totalSpendCents);
    }

    return [200, pageResponse(results.map(listItem), page, pageSize)];
  });

  mock.onGet(/api\/creator\/customers\/[^/?]+$/).reply((config) => {
    const customerId = config.url?.split('/').pop();
    const customer = customers.find((item) => item.id === customerId);

    return customer ? [200, customer] : [404, { message: 'Customer not found' }];
  });
};
