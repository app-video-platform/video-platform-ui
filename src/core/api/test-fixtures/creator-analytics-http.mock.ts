import MockAdapter from 'axios-mock-adapter';

import {
  AnalyticsPeriod,
  CreatorAnalyticsOverview,
  ProductAnalyticsItem,
} from 'core/api/models';

const periodLabels: Record<AnalyticsPeriod, string> = {
  '7d': 'last 7 days',
  '30d': 'last 30 days',
  '90d': 'last 90 days',
};

const previousPeriodLabels: Record<AnalyticsPeriod, string> = {
  '7d': 'previous 7 days',
  '30d': 'previous 30 days',
  '90d': 'previous 90 days',
};

const config: Record<
  AnalyticsPeriod,
  {
    points: number;
    revenue: number;
    orders: number;
    customers: number;
    activeMemberships: number;
  }
> = {
  '7d': {
    points: 7,
    revenue: 95800,
    orders: 14,
    customers: 13,
    activeMemberships: 318,
  },
  '30d': {
    points: 30,
    revenue: 342900,
    orders: 48,
    customers: 48,
    activeMemberships: 318,
  },
  '90d': {
    points: 13,
    revenue: 932600,
    orders: 147,
    customers: 127,
    activeMemberships: 318,
  },
};

const products: ProductAnalyticsItem[] = [
  {
    id: 'prod-course-growth',
    name: 'Creator Product Growth System',
    type: 'Course',
    revenueCents: 119200,
    orders: 8,
    share: 34.8,
  },
  {
    id: 'prod-membership-lab',
    name: 'Creator Systems Lab',
    type: 'Membership',
    revenueCents: 89700,
    orders: 23,
    share: 26.2,
  },
  {
    id: 'prod-consulting',
    name: 'Founder Positioning Intensive',
    type: 'Consultation',
    revenueCents: 75000,
    orders: 3,
    share: 21.9,
  },
  {
    id: 'prod-launch-toolkit',
    name: 'Launch Toolkit',
    type: 'Download',
    revenueCents: 39200,
    orders: 8,
    share: 11.4,
  },
  {
    id: 'prod-download-system',
    name: 'The Very Long Product Operations Template Pack for Launch Teams',
    type: 'Download',
    revenueCents: 19800,
    orders: 2,
    share: 5.8,
  },
];

export const buildCreatorAnalyticsOverviewTestFixture = (
  period: AnalyticsPeriod = '30d',
): CreatorAnalyticsOverview => {
  const current = config[period];
  const series = Array.from({ length: current.points }, (_, index) => ({
    label:
      period === '7d'
        ? `Aug ${index + 5}`
        : period === '30d'
          ? `Day ${index + 1}`
          : `Week ${index + 1}`,
    revenue: index === 0 ? current.revenue : 0,
    orders: index === 0 ? current.orders : 0,
    customers: index === 0 ? current.customers : 0,
    newMemberships: index % 5 === 0 ? 2 : 1,
    cancelledMemberships: index % 13 === 0 ? 1 : 0,
    refunds: index === current.points - 3 ? 1 : 0,
    failedPayments: index % 9 === 0 ? 1 : 0,
  }));

  return {
    period,
    periodLabel: periodLabels[period],
    previousPeriodLabel: previousPeriodLabels[period],
    metrics: [
      {
        id: 'revenue',
        label: 'Revenue',
        value:
          period === '7d' ? '€958' : period === '30d' ? '€3,429' : '€9,326',
        comparison: `+8.0% vs ${previousPeriodLabels[period]}`,
        direction: 'up',
        sentiment: 'favorable',
      },
      {
        id: 'orders',
        label: 'Orders',
        value: String(current.orders),
        comparison: `+2.0% vs ${previousPeriodLabels[period]}`,
        direction: 'up',
        sentiment: 'favorable',
      },
      {
        id: 'customers',
        label: 'Customers',
        value: '1,284',
        comparison: `+11.6% vs ${previousPeriodLabels[period]}`,
        direction: 'up',
        sentiment: 'favorable',
      },
      {
        id: 'active-memberships',
        label: 'Active memberships',
        value: String(current.activeMemberships),
        comparison: `+1.6% vs ${previousPeriodLabels[period]}`,
        direction: 'up',
        sentiment: 'favorable',
      },
    ],
    performance: {
      series,
      revenueDelta: 8,
      orderDelta: 2,
    },
    products,
    customerGrowth: {
      summary: {
        totalCustomers: 1284,
        newCustomers: current.customers,
        comparison: `+11.6% vs ${previousPeriodLabels[period]}`,
      },
      series,
    },
    memberships: {
      summary: {
        active: current.activeMemberships,
        new: 34,
        cancelled: 5,
        churnRate: 1.6,
        insight: 'You\'re gaining more members than you\'re losing.',
      },
      series,
    },
    paymentHealth: {
      metrics: [
        {
          id: 'refund-rate',
          label: 'Refund rate',
          value: '2.1%',
          comparison: `↓ 0.7pp vs ${previousPeriodLabels[period]}`,
          direction: 'down',
          sentiment: 'favorable',
        },
        {
          id: 'failed-payments',
          label: 'Failed payments',
          value: '4',
          comparison: `↓ 1 vs ${previousPeriodLabels[period]}`,
          direction: 'down',
          sentiment: 'favorable',
        },
      ],
      series,
    },
  };
};

export const registerCreatorAnalyticsTestMocks = (mock: MockAdapter) => {
  mock.onGet(/api\/creator\/analytics\/overview(?:\?.*)?$/).reply((config) => {
    const period =
      new URL(config.url ?? '', 'http://localhost').searchParams.get('period') ??
      '30d';

    return [
      200,
      buildCreatorAnalyticsOverviewTestFixture(period as AnalyticsPeriod),
    ];
  });
};
