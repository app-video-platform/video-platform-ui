import { CreatorSalesDataState, SalesOrder } from './creator-sales.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../../assets/image-placeholder.png');

const featuredOrders: SalesOrder[] = [
  {
    id: 'ORD-2026-00124',
    orderedAt: '2026-08-10T14:32:00.000Z',
    status: 'paid',
    type: 'one-time',
    amountCents: 14900,
    currency: 'EUR',
    customer: {
      id: 'cust-maya-johnson',
      name: 'Maya Johnson',
      email: 'maya.johnson@example.test',
    },
    product: {
      id: 'prod-course-growth',
      name: 'Creator Product Growth System',
      type: 'Course',
      thumbnailUrl: placeholderImage,
    },
    provider: 'Stripe',
    paymentMethod: 'Visa ending 4242',
    transactionId: 'pi_3QcreatorPaid124',
    paymentDate: '2026-08-10T14:32:00.000Z',
    summaryRows: [{ label: 'Total', amountCents: 14900 }],
    access: {
      state: 'granted',
      label: 'Access granted',
      detail: 'Course access is active for this customer.',
    },
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
    product: {
      id: 'prod-membership-lab',
      name: 'Creator Systems Lab',
      type: 'Membership',
      thumbnailUrl: placeholderImage,
    },
    provider: 'Stripe',
    paymentMethod: 'Mastercard ending 1881',
    transactionId: 'pi_3QcreatorRenewal123',
    paymentDate: '2026-08-10T09:18:00.000Z',
    summaryRows: [{ label: 'Total', amountCents: 3900 }],
    access: {
      state: 'granted',
      label: 'Access granted',
      detail: 'Membership access remains active after renewal.',
    },
    subscription: {
      priceCents: 3900,
      currency: 'EUR',
      interval: 'month',
      state: 'active',
      nextBillingAt: '2026-09-10T09:18:00.000Z',
    },
  },
  {
    id: 'ORD-2026-00122',
    orderedAt: '2026-08-09T16:08:00.000Z',
    status: 'paid',
    type: 'subscription',
    amountCents: 3900,
    currency: 'EUR',
    customer: {
      id: 'cust-elena-garcia',
      name: 'Elena Garcia',
      email: 'elena.garcia@example.test',
    },
    product: {
      id: 'prod-membership-lab',
      name: 'Creator Systems Lab',
      type: 'Membership',
      thumbnailUrl: placeholderImage,
    },
    provider: 'Stripe',
    paymentMethod: 'Visa ending 0008',
    transactionId: 'pi_3QcreatorInitial122',
    paymentDate: '2026-08-09T16:08:00.000Z',
    summaryRows: [{ label: 'Total', amountCents: 3900 }],
    access: {
      state: 'granted',
      label: 'Access granted',
      detail: 'Membership access started with this payment.',
    },
    subscription: {
      priceCents: 3900,
      currency: 'EUR',
      interval: 'month',
      state: 'active',
      nextBillingAt: '2026-09-09T16:08:00.000Z',
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
    product: {
      id: 'prod-launch-toolkit',
      name: 'Launch Toolkit',
      type: 'Download',
      thumbnailUrl: placeholderImage,
    },
    provider: 'Stripe',
    paymentMethod: 'Visa ending 2222',
    transactionId: 'pi_3QcreatorRefund121',
    paymentDate: '2026-08-08T11:42:00.000Z',
    summaryRows: [{ label: 'Total', amountCents: 4900 }],
    access: {
      state: 'revoked',
      label: 'Access revoked',
      detail: 'Download access was removed after the refund.',
    },
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
    product: {
      id: 'prod-membership-lab',
      name: 'Creator Systems Lab',
      type: 'Membership',
      thumbnailUrl: placeholderImage,
    },
    provider: 'Stripe',
    paymentMethod: 'Card ending 0341',
    transactionId: 'pi_3QcreatorFailed120',
    summaryRows: [{ label: 'Total', amountCents: 3900 }],
    access: {
      state: 'granted',
      label: 'Access granted',
      detail: 'Existing membership access remains active during payment recovery.',
    },
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
    product: {
      id: 'prod-consulting',
      name: 'Founder Positioning Intensive',
      type: 'Consultation',
      thumbnailUrl: placeholderImage,
    },
    provider: 'Stripe',
    paymentMethod: 'Amex ending 1009',
    transactionId: 'pi_3QcreatorConsult119',
    paymentDate: '2026-08-05T13:20:00.000Z',
    summaryRows: [{ label: 'Total', amountCents: 25000 }],
    access: {
      state: 'none',
      label: 'No access granted',
      detail: 'This purchase booked a consultation rather than product library access.',
    },
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
      thumbnailUrl: placeholderImage,
    },
    provider: 'Stripe',
    paymentMethod: 'Bank transfer',
    transactionId: 'pi_3QcreatorPending118',
    summaryRows: [{ label: 'Total', amountCents: 9900 }],
    access: {
      state: 'none',
      label: 'No access granted',
      detail: 'Access will be granted after payment confirmation.',
    },
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
      thumbnailUrl: placeholderImage,
    },
    provider: 'Internal checkout',
    transactionId: 'free_2026_00117',
    paymentDate: '2026-07-18T10:00:00.000Z',
    summaryRows: [{ label: 'Total', amountCents: 0 }],
    access: {
      state: 'granted',
      label: 'Access granted',
      detail: 'Free download access is active for this customer.',
    },
  },
];

const productTemplates: Record<
  string,
  SalesOrder['product'] & { defaultAmountCents: number }
> = {
  course: {
    id: 'prod-course-growth',
    name: 'Creator Product Growth System',
    type: 'Course',
    thumbnailUrl: placeholderImage,
    defaultAmountCents: 14900,
  },
  membership: {
    id: 'prod-membership-lab',
    name: 'Creator Systems Lab',
    type: 'Membership',
    thumbnailUrl: placeholderImage,
    defaultAmountCents: 3900,
  },
  download: {
    id: 'prod-launch-toolkit',
    name: 'Launch Toolkit',
    type: 'Download',
    thumbnailUrl: placeholderImage,
    defaultAmountCents: 4900,
  },
  consulting: {
    id: 'prod-consulting',
    name: 'Founder Positioning Intensive',
    type: 'Consultation',
    thumbnailUrl: placeholderImage,
    defaultAmountCents: 25000,
  },
  longDownload: {
    id: 'prod-download-system',
    name: 'The Very Long Product Operations Template Pack for Launch Teams',
    type: 'Download',
    thumbnailUrl: placeholderImage,
    defaultAmountCents: 9900,
  },
  free: {
    id: 'prod-free-mini',
    name: 'Free Creator Checklist',
    type: 'Download',
    thumbnailUrl: placeholderImage,
    defaultAmountCents: 0,
  },
};

const supplementalCustomers = [
  'Amara Stone',
  'Theo Morgan',
  'Priya Shah',
  'Jon Bell',
  'Nadia Flores',
  'Iris Novak',
  'Caleb Grant',
  'Leah Brooks',
  'Owen Miller',
  'Sofia Duarte',
  'Kai Bennett',
  'Mina Rossi',
  'Elliot Ward',
  'Hana Park',
  'Ari Cohen',
  'Tessa Lane',
  'Milo Reed',
  'Clara Weiss',
  'Zara King',
  'Mateo Silva',
  'Eva Hart',
  'Ravi Mehta',
  'Isla Ford',
  'Felix Brown',
  'Nina Vogel',
  'Oscar Hayes',
  'Luca Marin',
  'Jade Wilson',
  'Sana Ali',
  'Marco Ruiz',
];

const supplementalTimeBySlot = [
  '08:14:00.000Z',
  '10:26:00.000Z',
  '12:48:00.000Z',
  '15:05:00.000Z',
  '17:33:00.000Z',
  '19:12:00.000Z',
];

const addDays = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const buildCustomer = (index: number): SalesOrder['customer'] => {
  const name = supplementalCustomers[index % supplementalCustomers.length];
  const slug = name.toLowerCase().replace(/\s+/g, '.');

  return {
    id: `cust-${slug.replace(/\./g, '-')}`,
    name,
    email: `${slug}@example.test`,
  };
};

const buildSupplementalOrder = ({
  day,
  index,
  productKey,
  status = 'paid',
  type,
}: {
  day: string;
  index: number;
  productKey: keyof typeof productTemplates;
  status?: SalesOrder['status'];
  type?: SalesOrder['type'];
}): SalesOrder => {
  const product = productTemplates[productKey];
  const orderType =
    type ?? (product.type === 'Membership' ? 'renewal' : 'one-time');
  const orderedAt = `${day}T${supplementalTimeBySlot[index % supplementalTimeBySlot.length]}`;
  const amountCents = product.defaultAmountCents;
  const order: SalesOrder = {
    id: `ORD-2026-${String(90000 + index)}`,
    orderedAt,
    status,
    type: orderType,
    amountCents,
    currency: 'EUR',
    customer: buildCustomer(index),
    product,
    provider: productKey === 'free' ? 'Internal checkout' : 'Stripe',
    transactionId: `${status}_${productKey}_${index}`,
    summaryRows: [{ label: 'Total', amountCents }],
    access: {
      state: status === 'refunded' ? 'revoked' : product.type === 'Consultation' ? 'none' : 'granted',
      label:
        status === 'refunded'
          ? 'Access revoked'
          : product.type === 'Consultation'
            ? 'No access granted'
            : 'Access granted',
      detail:
        status === 'refunded'
          ? 'Access was removed after the refund.'
          : product.type === 'Consultation'
            ? 'This purchase booked a consultation rather than product library access.'
            : 'Product access is active for this customer.',
    },
  };

  if (status === 'paid') {
    order.paymentDate = orderedAt;
  }

  if (status === 'failed') {
    order.failure = {
      message: 'Card was declined.',
      retryAt: `${addDays(day, 3)}T09:00:00.000Z`,
    };
  }

  if (status === 'refunded') {
    order.refund = {
      amountCents,
      refundedAt: `${addDays(day, 1)}T10:15:00.000Z`,
      reason: 'Customer request',
    };
  }

  if (product.type === 'Membership') {
    order.subscription = {
      priceCents: product.defaultAmountCents,
      currency: 'EUR',
      interval: 'month',
      state: status === 'failed' ? 'past_due' : 'active',
      nextBillingAt: `${addDays(day, status === 'failed' ? 3 : 30)}T09:00:00.000Z`,
    };
  }

  return order;
};

const supplementalOrders = (() => {
  const start = new Date('2026-05-12T00:00:00.000Z');
  const end = new Date('2026-08-10T00:00:00.000Z');
  const results: SalesOrder[] = [];
  let index = 0;

  for (
    let date = new Date(end), dayIndex = 90;
    date >= start;
    date.setUTCDate(date.getUTCDate() - 1), dayIndex -= 1
  ) {
    const day = date.toISOString().slice(0, 10);
    const addOrder = (
      productKey: keyof typeof productTemplates,
      status: SalesOrder['status'] = 'paid',
      type?: SalesOrder['type'],
    ) => {
      results.push(buildSupplementalOrder({ day, index, productKey, status, type }));
      index += 1;
    };

    if (dayIndex % 2 === 0) {
      addOrder('membership', 'paid', dayIndex % 6 === 0 ? 'subscription' : 'renewal');
    }
    if (dayIndex % 5 === 0) {
      addOrder('membership', 'paid', 'renewal');
    }
    if (dayIndex % 7 === 1) {
      addOrder('course');
    }
    if (dayIndex % 9 === 2) {
      addOrder('course');
    }
    if (dayIndex % 4 === 1) {
      addOrder('download');
    }
    if (dayIndex % 13 === 3) {
      addOrder('consulting');
    }
    if (dayIndex % 11 === 4) {
      addOrder('longDownload');
    }
    if (dayIndex % 10 === 6) {
      addOrder('free');
    }
    if (['2026-07-21', '2026-07-31', '2026-08-04'].includes(day)) {
      addOrder('download', 'failed');
    }
    if (['2026-07-24', '2026-08-02'].includes(day)) {
      addOrder('longDownload', 'pending');
    }
    if (['2026-06-18', '2026-07-03'].includes(day)) {
      addOrder('download', 'refunded');
    }
  }

  return results;
})();

const orders: SalesOrder[] = [...featuredOrders, ...supplementalOrders];

export const getCreatorSalesData = (): CreatorSalesDataState => {
  if (process.env.REACT_APP_USE_MOCKS !== 'true') {
    return { status: 'unavailable', orders: [] };
  }

  if (
    window.localStorage.getItem('creator-sales-empty') === 'true' ||
    new URLSearchParams(window.location.search).get('salesEmpty') === 'true'
  ) {
    return { status: 'ready', orders: [] };
  }

  return { status: 'ready', orders };
};
