import { appRoutes } from 'domains/app/routes/routes';

import { CreatorAnalyticsData, AnalyticsPeriod } from './creator-analytics.types';
import {
  analyticsPeriodLabel,
  buildMetric,
  buildPaymentMetric,
  formatAnalyticsMoney,
  formatAnalyticsNumber,
  formatAnalyticsPercent,
  getDeltaPercent,
  getProductShare,
  getSeriesTotal,
  previousPeriodLabel,
} from './creator-analytics.utils';

const unavailableAnalyticsData = (period: AnalyticsPeriod): CreatorAnalyticsData => ({
  status: 'unavailable',
  period,
  periodLabel: analyticsPeriodLabel[period],
  previousPeriodLabel: previousPeriodLabel[period],
  metrics: [],
  performance: {
    series: [],
    revenueDelta: 0,
    orderDelta: 0,
  },
  products: [],
  customerGrowth: {
    summary: {
      totalCustomers: 0,
      newCustomers: 0,
      comparison: '',
    },
    series: [],
  },
  memberships: {
    summary: null,
    series: [],
  },
  paymentHealth: {
    metrics: [],
    series: [],
  },
});

const periodConfig: Record<
  AnalyticsPeriod,
  {
    points: number;
    labelPrefix: string;
    activeMemberships: number;
    totalCustomers: number;
    previousRevenue: number;
    previousOrders: number;
    previousCustomers: number;
    previousActiveMemberships: number;
    previousRefundRate: number;
    previousFailedPayments: number;
  }
> = {
  '7d': {
    points: 7,
    labelPrefix: 'Aug',
    activeMemberships: 318,
    totalCustomers: 1284,
    previousRevenue: 88900,
    previousOrders: 16,
    previousCustomers: 12,
    previousActiveMemberships: 316,
    previousRefundRate: 4.5,
    previousFailedPayments: 1,
  },
  '30d': {
    points: 30,
    labelPrefix: 'Day',
    activeMemberships: 318,
    totalCustomers: 1284,
    previousRevenue: 317500,
    previousOrders: 46,
    previousCustomers: 43,
    previousActiveMemberships: 313,
    previousRefundRate: 2.8,
    previousFailedPayments: 5,
  },
  '90d': {
    points: 13,
    labelPrefix: 'Week',
    activeMemberships: 318,
    totalCustomers: 1284,
    previousRevenue: 1058000,
    previousOrders: 132,
    previousCustomers: 136,
    previousActiveMemberships: 321,
    previousRefundRate: 1.8,
    previousFailedPayments: 3,
  },
};

const revenueSeries: Record<AnalyticsPeriod, number[]> = {
  '7d': [3900, 48700, 3900, 0, 3900, 8800, 26600],
  '30d': [
    4900, 3900, 0, 18800, 23700, 3900, 0, 28900, 4900, 17700, 14900, 3900,
    4900, 18800, 3900, 3900, 4900, 18800, 0, 7800, 39800, 3900, 14900, 3900,
    48700, 3900, 0, 3900, 8800, 26600,
  ],
  '90d': [
    97900, 55200, 93000, 50200, 84100, 69000, 89100, 69200, 69000, 80200,
    68000, 90100, 95800,
  ],
};

const orderSeries: Record<AnalyticsPeriod, number[]> = {
  '7d': [1, 4, 2, 0, 1, 2, 4],
  '30d': [
    1, 1, 0, 2, 3, 2, 1, 2, 1, 3, 1, 1, 1, 2, 1, 2, 1, 2, 0, 2, 3, 1, 1,
    1, 4, 2, 0, 1, 2, 4,
  ],
  '90d': [13, 8, 12, 9, 10, 11, 11, 9, 11, 11, 11, 10, 14],
};

const customerSeries: Record<AnalyticsPeriod, number[]> = {
  '7d': [1, 4, 1, 0, 2, 2, 3],
  '30d': [
    1, 2, 0, 2, 3, 1, 0, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 3, 0, 2, 3, 1, 2,
    1, 4, 1, 0, 2, 2, 3,
  ],
  '90d': [9, 8, 11, 7, 10, 9, 12, 8, 10, 11, 9, 10, 13],
};

const newMembershipSeries: Record<AnalyticsPeriod, number[]> = {
  '7d': [0, 2, 1, 0, 1, 1, 2],
  '30d': [
    0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1,
    0, 2, 1, 0, 1, 1, 2,
  ],
  '90d': [5, 4, 5, 4, 6, 5, 5, 4, 5, 6, 4, 5, 6],
};

const cancelledMembershipSeries: Record<AnalyticsPeriod, number[]> = {
  '7d': [0, 1, 0, 0, 0, 0, 0],
  '30d': [
    0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    0, 0, 1, 0, 0, 0, 0,
  ],
  '90d': [1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 2],
};

const refundSeries: Record<AnalyticsPeriod, number[]> = {
  '7d': [0, 0, 0, 0, 1, 0, 0],
  '30d': [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 0, 0,
  ],
  '90d': [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
};

const failedPaymentSeries: Record<AnalyticsPeriod, number[]> = {
  '7d': [1, 0, 0, 1, 0, 0, 0],
  '30d': [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
    1, 0, 0, 1, 0, 0, 0,
  ],
  '90d': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2],
};

const buildSeries = (period: AnalyticsPeriod) => {
  const config = periodConfig[period];

  return revenueSeries[period].slice(0, config.points).map((revenue, index) => ({
    label:
      period === '7d'
        ? `${config.labelPrefix} ${5 + index}`
        : `${config.labelPrefix} ${index + 1}`,
    revenue,
    orders: orderSeries[period][index],
    customers: customerSeries[period][index],
    newMemberships: newMembershipSeries[period][index],
    cancelledMemberships: cancelledMembershipSeries[period][index],
    refunds: refundSeries[period][index],
    failedPayments: failedPaymentSeries[period][index],
  }));
};

const productBase = [
  {
    id: 'prod-course-growth',
    name: 'Creator Product Growth System',
    type: 'Course' as const,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 'prod-membership-lab',
    name: 'Creator Systems Lab',
    type: 'Membership' as const,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 'prod-consulting',
    name: 'Founder Positioning Intensive',
    type: 'Consultation' as const,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 'prod-launch-toolkit',
    name: 'Launch Toolkit',
    type: 'Download' as const,
  },
  {
    id: 'prod-download-system',
    name: 'The Very Long Product Operations Template Pack for Launch Teams',
    type: 'Download' as const,
  },
  {
    id: 'prod-free-mini',
    name: 'Free Creator Checklist',
    type: 'Download' as const,
  },
];

const productPerformanceByPeriod: Record<
  AnalyticsPeriod,
  Array<{ revenueCents: number; orders: number }>
> = {
  '7d': [
    { revenueCents: 29800, orders: 2 },
    { revenueCents: 31200, orders: 8 },
    { revenueCents: 25000, orders: 1 },
    { revenueCents: 9800, orders: 2 },
    { revenueCents: 0, orders: 0 },
    { revenueCents: 0, orders: 1 },
  ],
  '30d': [
    { revenueCents: 119200, orders: 8 },
    { revenueCents: 89700, orders: 23 },
    { revenueCents: 75000, orders: 3 },
    { revenueCents: 39200, orders: 8 },
    { revenueCents: 19800, orders: 2 },
    { revenueCents: 0, orders: 4 },
  ],
  '90d': [
    { revenueCents: 357600, orders: 24 },
    { revenueCents: 261300, orders: 67 },
    { revenueCents: 200000, orders: 8 },
    { revenueCents: 112700, orders: 23 },
    { revenueCents: 79200, orders: 8 },
    { revenueCents: 0, orders: 10 },
  ],
};

const buildProducts = (period: AnalyticsPeriod) =>
  getProductShare(
    productBase.map((product, index) => ({
      ...product,
      revenueCents: productPerformanceByPeriod[period][index].revenueCents,
      orders: productPerformanceByPeriod[period][index].orders,
      share: 0,
      destinationPath: appRoutes.productsEdit(product.id),
    })).sort((a, b) => b.revenueCents - a.revenueCents),
  );

export const getCreatorAnalyticsData = (
  period: AnalyticsPeriod,
): CreatorAnalyticsData => {
  if (process.env.REACT_APP_USE_MOCKS !== 'true') {
    return unavailableAnalyticsData(period);
  }

  const series = buildSeries(period);
  const config = periodConfig[period];
  const revenue = getSeriesTotal(series, 'revenue');
  const orders = getSeriesTotal(series, 'orders');
  const customers = getSeriesTotal(series, 'customers');
  const newMemberships = getSeriesTotal(series, 'newMemberships');
  const cancelledMemberships = getSeriesTotal(series, 'cancelledMemberships');
  const refunds = getSeriesTotal(series, 'refunds');
  const failedPayments = getSeriesTotal(series, 'failedPayments');
  const refundRate = orders === 0 ? 0 : (refunds / orders) * 100;
  const churnRate =
    config.activeMemberships === 0
      ? 0
      : (cancelledMemberships / config.activeMemberships) * 100;

  const revenueDelta = getDeltaPercent(revenue, config.previousRevenue);
  const orderDelta = getDeltaPercent(orders, config.previousOrders);
  const customerDelta = getDeltaPercent(customers, config.previousCustomers);
  return {
    status: 'ready',
    period,
    periodLabel: analyticsPeriodLabel[period],
    previousPeriodLabel: previousPeriodLabel[period],
    metrics: [
      buildMetric({
        id: 'revenue',
        label: 'Revenue',
        value: formatAnalyticsMoney(revenue),
        current: revenue,
        previous: config.previousRevenue,
        period,
      }),
      buildMetric({
        id: 'orders',
        label: 'Orders',
        value: formatAnalyticsNumber(orders),
        current: orders,
        previous: config.previousOrders,
        period,
      }),
      buildMetric({
        id: 'customers',
        label: 'Customers',
        value: formatAnalyticsNumber(config.totalCustomers),
        current: customers,
        previous: config.previousCustomers,
        period,
      }),
      buildMetric({
        id: 'active-memberships',
        label: 'Active memberships',
        value: formatAnalyticsNumber(config.activeMemberships),
        current: config.activeMemberships,
        previous: config.previousActiveMemberships,
        period,
      }),
    ],
    performance: {
      series,
      revenueDelta,
      orderDelta,
    },
    products: buildProducts(period),
    customerGrowth: {
      summary: {
        totalCustomers: config.totalCustomers,
        newCustomers: customers,
        comparison: `${customerDelta >= 0 ? '+' : ''}${customerDelta.toFixed(1)}% vs ${previousPeriodLabel[period]}`,
      },
      series,
    },
    memberships: {
      summary: {
        active: config.activeMemberships,
        new: newMemberships,
        cancelled: cancelledMemberships,
        churnRate,
        insight:
          newMemberships > cancelledMemberships
            ? 'You\'re gaining more members than you\'re losing.'
            : 'Membership cancellations are matching or outpacing new members.',
      },
      series,
    },
    paymentHealth: {
      metrics: [
        buildPaymentMetric({
          id: 'refund-rate',
          label: 'Refund rate',
          value: formatAnalyticsPercent(refundRate),
          delta: refundRate - config.previousRefundRate,
          period,
          favorableDirection: 'down',
          unit: 'pp',
        }),
        buildPaymentMetric({
          id: 'failed-payments',
          label: 'Failed payments',
          value: formatAnalyticsNumber(failedPayments),
          delta: failedPayments - config.previousFailedPayments,
          period,
          favorableDirection: 'down',
          unit: 'count',
        }),
      ],
      series,
    },
  };
};
