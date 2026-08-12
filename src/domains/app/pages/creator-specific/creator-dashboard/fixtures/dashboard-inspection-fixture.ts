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
        value: '€3,429',
        comparison: '+8% vs prior period',
        direction: 'up',
        sentiment: 'favorable',
        destinationPath: appRoutes.sales,
      },
      {
        id: 'sales',
        label: 'Sales',
        value: '48',
        comparison: '+2 orders',
        direction: 'up',
        sentiment: 'favorable',
        destinationPath: appRoutes.sales,
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
        id: 'activity-2',
        kind: 'membership-started',
        title: 'Membership started',
        context: 'Creator Systems Lab · Jules Carter',
        value: '€39/mo',
        timestamp: '38 min ago',
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
        destinationPath: appRoutes.productsEdit('prod-launch-toolkit'),
      },
      {
        id: 'activity-5',
        kind: 'membership-cancelled',
        title: 'Membership cancelled',
        context: 'Creator Systems Lab · Noah Kim',
        status: 'Churn',
        timestamp: 'Yesterday',
      },
    ],
    topProducts: [
      {
        id: 'prod-course-growth',
        name: 'Creator Product Growth System',
        type: 'Course',
        revenue: '€1,192',
        revenueShare: 100,
        destinationPath: appRoutes.productsEdit('prod-course-growth'),
        thumbnailUrl:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=160&q=80',
      },
      {
        id: 'prod-membership-lab',
        name: 'Creator Systems Lab',
        type: 'Membership',
        revenue: '€897',
        revenueShare: 75,
        destinationPath: appRoutes.productsEdit('prod-membership-lab'),
        thumbnailUrl:
          'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=160&q=80',
      },
      {
        id: 'prod-consulting',
        name: 'Founder Positioning Intensive',
        type: 'Consultation',
        revenue: '€750',
        revenueShare: 63,
        destinationPath: appRoutes.productsEdit('prod-consulting'),
        thumbnailUrl:
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=160&q=80',
      },
      {
        id: 'prod-launch-toolkit',
        name: 'Launch Toolkit',
        type: 'Download',
        revenue: '€392',
        revenueShare: 33,
        destinationPath: appRoutes.productsEdit('prod-launch-toolkit'),
      },
      {
        id: 'prod-download-system',
        name: 'The Very Long Product Operations Template Pack for Launch Teams',
        type: 'Download',
        revenue: '€198',
        revenueShare: 17,
        destinationPath: appRoutes.productsEdit('prod-download-system'),
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
