import { appRoutes } from 'domains/app/routes/routes';

export type MetricDirection = 'up' | 'down' | 'flat';
export type MetricSentiment = 'favorable' | 'unfavorable' | 'neutral';
export type MetricState = 'ready' | 'loading' | 'unavailable';

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  comparison?: string;
  direction?: MetricDirection;
  sentiment?: MetricSentiment;
  state?: MetricState;
  destinationPath?: string;
}

export type ActivityKind =
  | 'sale'
  | 'customer'
  | 'membership-started'
  | 'membership-renewed'
  | 'membership-cancelled'
  | 'failed-payment'
  | 'product-published'
  | 'product-updated';

export interface DashboardActivity {
  id: string;
  kind: ActivityKind;
  title: string;
  context?: string;
  value?: string;
  status?: string;
  timestamp: string;
  destinationPath?: string;
}

export interface ProductPerformanceItem {
  id: string;
  name: string;
  type: string;
  revenue: string;
  revenueShare: number;
  thumbnailUrl?: string;
  destinationPath?: string;
}

export type AttentionSeverity = 'high' | 'medium' | 'low';

export interface AttentionItem {
  id: string;
  issue: string;
  context: string;
  severity: AttentionSeverity;
  actionLabel: string;
  actionPath?: string;
  actionDisabledReason?: string;
}

export interface CreatorDashboardFixture {
  metrics: DashboardMetric[];
  activities: DashboardActivity[];
  topProducts: ProductPerformanceItem[];
  attentionItems: AttentionItem[];
}

export const getCreatorDashboardInspectionFixture =
  (): CreatorDashboardFixture => ({
    metrics: [
      {
        id: 'revenue',
        label: 'Revenue',
        value: '€18,420',
        comparison: '+12% vs last 30 days',
        direction: 'up',
        sentiment: 'favorable',
        destinationPath: appRoutes.sales,
      },
      {
        id: 'sales',
        label: 'Sales',
        value: '142',
        comparison: '+8 orders',
        direction: 'up',
        sentiment: 'favorable',
        destinationPath: appRoutes.sales,
      },
      {
        id: 'customers',
        label: 'Customers',
        value: '1,284',
        comparison: 'No prior period',
        direction: 'flat',
        sentiment: 'neutral',
      },
      {
        id: 'active-memberships',
        label: 'Active memberships',
        value: '318',
        comparison: '-3% vs last 30 days',
        direction: 'down',
        sentiment: 'unfavorable',
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
        id: 'activity-2',
        kind: 'membership-started',
        title: 'Membership started',
        context: 'Creator Systems Lab membership · Jules Carter',
        value: '€39/mo',
        timestamp: '38 min ago',
      },
      {
        id: 'activity-3',
        kind: 'failed-payment',
        title: 'Payment failed',
        context: 'Creator Systems Lab membership · Mira Patel',
        status: 'Retry scheduled',
        timestamp: '2h ago',
      },
      {
        id: 'activity-4',
        kind: 'product-updated',
        title: 'Product updated',
        context: 'Launch Toolkit',
        timestamp: 'Yesterday',
        destinationPath: appRoutes.productsEdit('prod-download-toolkit'),
      },
      {
        id: 'activity-5',
        kind: 'membership-cancelled',
        title: 'Membership cancelled',
        context: 'Creator Systems Lab membership · Noah Kim',
        status: 'Churn',
        timestamp: 'Yesterday',
      },
    ],
    topProducts: [
      {
        id: 'prod-course-growth',
        name: 'Creator Product Growth System',
        type: 'Course',
        revenue: '€9,240',
        revenueShare: 100,
        destinationPath: appRoutes.productsEdit('prod-course-growth'),
        thumbnailUrl:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=160&q=80',
      },
      {
        id: 'prod-consultation-audit',
        name: 'Offer audit consultation',
        type: 'Consultation',
        revenue: '€4,750',
        revenueShare: 51,
        destinationPath: appRoutes.productsEdit('prod-consultation-audit'),
        thumbnailUrl:
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=160&q=80',
      },
      {
        id: 'prod-membership-lab',
        name: 'Creator Systems Lab membership',
        type: 'Membership',
        revenue: '€3,198',
        revenueShare: 35,
        destinationPath: appRoutes.productsEdit('prod-membership-lab'),
        thumbnailUrl:
          'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=160&q=80',
      },
      {
        id: 'prod-download-toolkit',
        name: 'Launch Toolkit',
        type: 'Download',
        revenue: '€1,232',
        revenueShare: 13,
        destinationPath: appRoutes.productsEdit('prod-download-toolkit'),
      },
    ],
    attentionItems: [
      {
        id: 'attention-membership-thumbnail',
        issue: 'Membership is missing a thumbnail',
        context: 'Creator Systems Lab membership',
        severity: 'medium',
        actionLabel: 'Add media',
        actionPath: appRoutes.productsEdit('prod-membership-lab'),
      },
      {
        id: 'attention-calendar',
        issue: 'Consultation calendar disconnected',
        context: 'Offer audit consultation',
        severity: 'high',
        actionLabel: 'Reconnect',
        actionPath: `${appRoutes.settings}?tab=calendar`,
      },
      {
        id: 'attention-drafts',
        issue: 'Two draft products are close to publish-ready',
        context: 'Launch Toolkit and Creator Systems Lab',
        severity: 'low',
        actionLabel: 'Review drafts',
        actionPath: appRoutes.products,
      },
    ],
  });
