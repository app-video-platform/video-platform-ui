import MockAdapter from 'axios-mock-adapter';

import { CreatorDashboardSummary } from 'core/api/models';

export const creatorDashboardSummaryTestFixture: CreatorDashboardSummary = {
  metrics: [
    {
      id: 'revenue',
      label: 'Revenue',
      value: '€3,429',
      comparison: '+8% vs prior period',
      direction: 'up',
      sentiment: 'favorable',
      destinationPath: '/app/sales',
    },
    {
      id: 'sales',
      label: 'Sales',
      value: '48',
      comparison: '+2 orders',
      direction: 'up',
      sentiment: 'favorable',
      destinationPath: '/app/sales',
    },
    {
      id: 'customers',
      label: 'Customers',
      value: '1,284',
      comparison: '+48 this period',
      direction: 'up',
      sentiment: 'favorable',
    },
    {
      id: 'active-memberships',
      label: 'Active memberships',
      value: '318',
      comparison: '+1.6% vs last 30 days',
      direction: 'up',
      sentiment: 'favorable',
    },
  ],
  activities: [
    {
      id: 'activity-1',
      kind: 'sale',
      title: 'New sale',
      context: 'Creator Product Growth System',
      value: '€149',
      timestamp: '12 min ago',
    },
    {
      id: 'activity-3',
      kind: 'failed-payment',
      title: 'Payment failed',
      context: 'Creator Systems Lab · Mira Patel',
      status: 'Retry scheduled',
      timestamp: '2h ago',
    },
    {
      id: 'activity-4',
      kind: 'product-updated',
      title: 'Product updated',
      context: 'Launch Toolkit',
      timestamp: 'Yesterday',
      destinationPath: '/app/products/edit/prod-launch-toolkit',
    },
  ],
  topProducts: [
    {
      id: 'prod-course-growth',
      name: 'Creator Product Growth System',
      type: 'Course',
      revenue: '€1,192',
      revenueShare: 100,
      destinationPath: '/app/products/edit/prod-course-growth',
    },
    {
      id: 'prod-launch-toolkit',
      name: 'Launch Toolkit',
      type: 'Download',
      revenue: '€392',
      revenueShare: 33,
      destinationPath: '/app/products/edit/prod-launch-toolkit',
    },
  ],
  attentionItems: [
    {
      id: 'attention-membership-thumbnail',
      issue: 'Membership is missing a thumbnail',
      context: 'Creator Systems Lab membership',
      severity: 'medium',
      actionLabel: 'Add media',
      actionPath: '/app/products/edit/prod-membership-lab',
    },
    {
      id: 'attention-calendar',
      issue: 'Consultation calendar disconnected',
      context: 'Offer audit consultation',
      severity: 'high',
      actionLabel: 'Reconnect',
      actionPath: '/app/settings?tab=calendar',
    },
    {
      id: 'attention-drafts',
      issue: 'Two draft products are close to publish-ready',
      context: 'Launch Toolkit and Creator Systems Lab',
      severity: 'low',
      actionLabel: 'Review drafts',
      actionPath: '/app/products',
    },
    {
      id: 'attention-static',
      issue: 'No routed action exists yet',
      context: 'Backend-owned reminder',
      severity: 'low',
      actionLabel: 'No action',
      actionDisabledReason: 'No destination is available.',
    },
  ],
};

export const registerCreatorDashboardTestMocks = (mock: MockAdapter) => {
  mock
    .onGet('api/creator/dashboard/summary')
    .reply(200, creatorDashboardSummaryTestFixture);
};
