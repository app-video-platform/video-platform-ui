import MockAdapter from 'axios-mock-adapter';

import {
  CreatorOrdersPage,
  CreatorSalesSummary,
  SalesOrder,
  SalesOrderListItem,
} from 'core/api/models';

const productGrowth = {
  id: 'prod-course-growth',
  name: 'Creator Product Growth System',
  type: 'Course' as const,
};
const membershipLab = {
  id: 'prod-membership-lab',
  name: 'Creator Systems Lab',
  type: 'Membership' as const,
};
const launchToolkit = {
  id: 'prod-launch-toolkit',
  name: 'Launch Toolkit',
  type: 'Download' as const,
};
const consulting = {
  id: 'prod-consulting',
  name: 'Founder Positioning Intensive',
  type: 'Consultation' as const,
};

const baseOrders: SalesOrder[] = [
  {
    id: 'ORD-2026-00124',
    orderedAt: '2026-08-10T14:32:00.000Z',
    status: 'paid',
    type: 'one-time',
    amountCents: 19800,
    currency: 'EUR',
    customer: {
      id: 'cust-maya-johnson',
      name: 'Maya Johnson',
      email: 'maya.johnson@example.test',
    },
    items: [
      {
        product: productGrowth,
        amountCents: 14900,
        access: { state: 'granted', label: 'Access granted' },
      },
      {
        product: launchToolkit,
        amountCents: 4900,
        access: {
          state: 'revoked',
          label: 'Access revoked',
          detail: 'Refund removed access to the download package.',
        },
      },
    ],
    product: membershipLab,
    provider: 'Stripe',
    paymentMethod: 'Visa ending 4242',
    transactionId: 'pi_3QcreatorPaid124',
    paymentDate: '2026-08-10T14:32:00.000Z',
    summaryRows: [{ label: 'Total', amountCents: 19800 }],
    access: { state: 'none', label: 'No access granted' },
  },
  {
    id: 'ORD-2026-00123',
    orderedAt: '2026-08-10T09:18:00.000Z',
    status: 'paid',
    type: 'renewal',
    amountCents: 3900,
    currency: 'EUR',
    customer: {
      id: 'cust-alex-rivera',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.test',
    },
    product: membershipLab,
    provider: 'Stripe',
    paymentMethod: 'Mastercard ending 1881',
    transactionId: 'pi_3QcreatorRenewal123',
    paymentDate: '2026-08-10T09:18:00.000Z',
    summaryRows: [{ label: 'Total', amountCents: 3900 }],
    access: { state: 'granted', label: 'Access granted' },
    subscription: {
      priceCents: 3900,
      currency: 'EUR',
      interval: 'month',
      state: 'active',
      nextBillingAt: '2026-09-10T09:18:00.000Z',
    },
  },
  {
    id: 'ORD-2026-00121',
    orderedAt: '2026-08-08T11:42:00.000Z',
    status: 'refunded',
    type: 'one-time',
    amountCents: 4900,
    currency: 'EUR',
    customer: {
      id: 'cust-jamie-chen',
      name: 'Jamie Chen',
      email: 'jamie.chen@example.test',
    },
    product: launchToolkit,
    provider: 'Stripe',
    paymentMethod: 'Visa ending 2222',
    transactionId: 'pi_3QcreatorRefund121',
    paymentDate: '2026-08-08T11:42:00.000Z',
    summaryRows: [{ label: 'Total', amountCents: 4900 }],
    access: { state: 'revoked', label: 'Access revoked' },
    refund: {
      amountCents: 4900,
      refundedAt: '2026-08-09T10:05:00.000Z',
      reason: 'Customer request',
    },
  },
  {
    id: 'ORD-2026-00120',
    orderedAt: '2026-08-07T08:36:00.000Z',
    status: 'failed',
    type: 'renewal',
    amountCents: 3900,
    currency: 'EUR',
    customer: {
      id: 'cust-mira-patel',
      name: 'Mira Patel',
      email: 'mira.patel@example.test',
    },
    product: membershipLab,
    provider: 'Stripe',
    paymentMethod: 'Card ending 0341',
    transactionId: 'pi_3QcreatorFailed120',
    summaryRows: [{ label: 'Total', amountCents: 3900 }],
    access: { state: 'granted', label: 'Access granted' },
    failure: {
      message: 'Card was declined.',
      retryAt: '2026-08-12T08:36:00.000Z',
    },
    subscription: {
      priceCents: 3900,
      currency: 'EUR',
      interval: 'month',
      state: 'past_due',
      nextBillingAt: '2026-08-12T08:36:00.000Z',
    },
  },
  {
    id: 'ORD-2026-00119',
    orderedAt: '2026-08-05T13:20:00.000Z',
    status: 'paid',
    type: 'one-time',
    amountCents: 25000,
    currency: 'EUR',
    customer: {
      id: 'cust-noah-smith',
      name: 'Noah Smith',
      email: 'noah.smith@example.test',
    },
    product: consulting,
    provider: 'Stripe',
    transactionId: 'pi_3QcreatorConsult119',
    summaryRows: [{ label: 'Total', amountCents: 25000 }],
    access: { state: 'none', label: 'No access granted' },
  },
  {
    id: 'ORD-2026-00118',
    orderedAt: '2026-07-28T18:15:00.000Z',
    status: 'pending',
    type: 'one-time',
    amountCents: 9900,
    currency: 'EUR',
    customer: {
      name: 'Samira Longlastname-With-Company-Identifier',
      email: 'samira.long.identity@example.test',
    },
    product: {
      id: 'prod-download-system',
      name: 'The Very Long Product Operations Template Pack for Launch Teams',
      type: 'Download',
    },
    provider: 'Stripe',
    transactionId: 'pi_3QcreatorPending118',
    summaryRows: [{ label: 'Total', amountCents: 9900 }],
    access: { state: 'none', label: 'No access granted' },
  },
  {
    id: 'ORD-2026-00117',
    orderedAt: '2026-07-18T10:00:00.000Z',
    status: 'paid',
    type: 'one-time',
    amountCents: 0,
    currency: 'EUR',
    customer: {
      id: 'cust-lina-kowalski',
      name: 'Lina Kowalski',
      email: 'lina.kowalski@example.test',
    },
    product: {
      id: 'prod-free-mini',
      name: 'Free Creator Checklist',
      type: 'Download',
    },
    provider: 'Internal checkout',
    transactionId: 'free_2026_00117',
    summaryRows: [{ label: 'Total', amountCents: 0 }],
    access: { state: 'granted', label: 'Access granted' },
  },
];

const generatedOrders: SalesOrder[] = Array.from({ length: 49 }, (_, index) => ({
  id: `ORD-2026-000${String(index + 1).padStart(2, '0')}`,
  orderedAt: `2026-07-${String((index % 20) + 1).padStart(2, '0')}T10:00:00.000Z`,
  status: 'paid',
  type: 'one-time',
  amountCents: 4900,
  currency: 'EUR',
  customer: {
    id: `cust-generated-${index}`,
    name: `Customer ${index + 1}`,
    email: `customer${index + 1}@example.test`,
  },
  product: launchToolkit,
  provider: 'Stripe',
  transactionId: `pi_generated_${index}`,
  summaryRows: [{ label: 'Total', amountCents: 4900 }],
  access: { state: 'granted', label: 'Access granted' },
}));

const orders = [...baseOrders, ...generatedOrders];
const productOptions = [productGrowth, membershipLab, launchToolkit, consulting];

const listItem = (order: SalesOrder): SalesOrderListItem => ({
  id: order.id,
  orderedAt: order.orderedAt,
  status: order.status,
  type: order.type,
  amountCents: order.amountCents,
  currency: order.currency,
  customer: order.customer,
  items: order.items,
  product: order.product,
  access: order.access,
});

const getOrderProducts = (order: SalesOrder) =>
  order.items?.length
    ? order.items.map((item) => item.product)
    : order.product
      ? [order.product]
      : [];

const getParam = (url: string, key: string) =>
  new URL(url, 'http://localhost').searchParams.get(key);

const pageResponse = (
  content: SalesOrderListItem[],
  page = 0,
  pageSize = 10,
): CreatorOrdersPage => ({
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

const summary = (period: CreatorSalesSummary['period']): CreatorSalesSummary => ({
  period,
  metrics: [
    {
      label: 'Revenue',
      value: 'EUR 42,310',
      direction: 'up',
      sentiment: 'favorable',
      comparison: '+12%',
    },
    {
      label: 'Orders',
      value: '56',
      direction: 'up',
      sentiment: 'favorable',
      comparison: '+8%',
    },
    {
      label: 'Refunds',
      value: 'EUR 49',
      direction: 'down',
      sentiment: 'favorable',
      comparison: '-2%',
    },
    {
      label: 'Failed payments',
      value: '1',
      direction: 'flat',
      sentiment: 'neutral',
      comparison: 'No change',
    },
  ],
});

export const registerCreatorSalesTestMocks = (mock: MockAdapter) => {
  mock.onGet(/api\/creator\/sales\/summary(?:\?.*)?$/).reply((config) => {
    const period = getParam(config.url ?? '', 'period') ?? '30d';
    return [200, summary(period as CreatorSalesSummary['period'])];
  });

  mock.onGet(/api\/creator\/orders(?:\?.*)?$/).reply((config) => {
    const url = config.url ?? '';
    const search = getParam(url, 'search')?.toLowerCase() ?? '';
    const status = getParam(url, 'status');
    const product = getParam(url, 'product');
    const period = getParam(url, 'period');
    const sort = getParam(url, 'sort');
    const page = Number(getParam(url, 'page') ?? 0);
    const pageSize = Number(getParam(url, 'pageSize') ?? 10);

    let results = orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.id.toLowerCase().includes(search) ||
        order.customer.name.toLowerCase().includes(search) ||
        order.customer.email.toLowerCase().includes(search);
      const matchesStatus = !status || order.status === status;
      const matchesProduct = !product ||
        getOrderProducts(order).some((item) => item.id === product);
      const generatedOrderNumber = order.id.startsWith('ORD-2026-000')
        ? Number(order.id.slice(-2))
        : null;
      const matchesPeriod =
        period !== '7d' ||
        !order.id.startsWith('ORD-2026-000') ||
        Number(generatedOrderNumber) <= 10;

      return matchesSearch && matchesStatus && matchesProduct && matchesPeriod;
    });

    if (sort === 'amount-desc') {
      results = [...results].sort((a, b) => b.amountCents - a.amountCents);
    }

    return [200, pageResponse(results.map(listItem), page, pageSize)];
  });

  mock.onGet(/api\/creator\/orders\/[^/?]+$/).reply((config) => {
    const orderId = config.url?.split('/').pop();
    const order = orders.find((item) => item.id === orderId);

    return order ? [200, order] : [404, { message: 'Order not found' }];
  });
};
