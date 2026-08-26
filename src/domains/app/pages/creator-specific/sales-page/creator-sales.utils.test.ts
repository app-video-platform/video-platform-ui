import { SalesOrder } from 'core/api/models';

import {
  defaultSalesFilterForm,
  filterAndSortSalesOrders,
  getSalesOrderItems,
  getSalesProductOptions,
} from './creator-sales.utils';

const course = {
  id: 'prod-course',
  name: 'Course',
  type: 'Course' as const,
};
const download = {
  id: 'prod-download',
  name: 'Download',
  type: 'Download' as const,
};
const membership = {
  id: 'prod-membership',
  name: 'Membership',
  type: 'Membership' as const,
};

const order: SalesOrder = {
  id: 'ORD-1',
  orderedAt: '2026-08-10T10:00:00.000Z',
  status: 'paid',
  type: 'one-time',
  amountCents: 19800,
  currency: 'EUR',
  customer: {
    id: 'cust-1',
    name: 'Customer',
    email: 'customer@example.test',
  },
  items: [
    {
      product: course,
      amountCents: 14900,
      access: { state: 'granted', label: 'Access granted' },
    },
    {
      product: download,
      amountCents: 4900,
      access: { state: 'revoked', label: 'Access revoked' },
    },
  ],
  product: membership,
  summaryRows: [{ label: 'Total', amountCents: 19800 }],
  access: { state: 'none', label: 'No access granted' },
};

describe('creator sales utils', () => {
  it('returns authoritative items without merging singular compatibility fields', () => {
    expect(getSalesOrderItems(order)).toEqual(order.items);
    expect(getSalesOrderItems(order).map((item) => item.product.name)).toEqual([
      'Course',
      'Download',
    ]);
  });

  it('synthesizes a single display item from singular compatibility fields', () => {
    const legacyOrder: SalesOrder = {
      ...order,
      id: 'ORD-2',
      items: undefined,
      product: membership,
      amountCents: 3900,
      access: { state: 'granted', label: 'Access granted' },
    };

    expect(getSalesOrderItems(legacyOrder)).toEqual([
      {
        product: membership,
        amountCents: 3900,
        access: { state: 'granted', label: 'Access granted' },
      },
    ]);
  });

  it('does not invent access for incomplete singular compatibility data', () => {
    expect(getSalesOrderItems({ ...order, items: undefined, access: undefined }))
      .toEqual([]);
  });

  it('builds product options from every authoritative item', () => {
    expect(getSalesProductOptions([order])).toEqual([
      { value: 'prod-course', label: 'Course' },
      { value: 'prod-download', label: 'Download' },
    ]);
  });

  it('filters by a product that appears only in a later item', () => {
    const results = filterAndSortSalesOrders([order], {
      ...defaultSalesFilterForm,
      product: 'prod-download',
    });

    expect(results).toEqual([order]);
  });
});
