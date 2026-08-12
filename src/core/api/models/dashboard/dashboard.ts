export type DashboardMetricDirection = 'up' | 'down' | 'flat';
export type DashboardMetricSentiment = 'favorable' | 'unfavorable' | 'neutral';
export type DashboardMetricState = 'ready' | 'loading' | 'unavailable';

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  comparison?: string;
  direction?: DashboardMetricDirection;
  sentiment?: DashboardMetricSentiment;
  state?: DashboardMetricState;
  destinationPath?: string;
}

export type DashboardActivityKind =
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
  kind: DashboardActivityKind;
  title: string;
  context?: string;
  value?: string;
  status?: string;
  timestamp: string;
  destinationPath?: string;
}

export interface DashboardTopProduct {
  id: string;
  name: string;
  type: string;
  revenue: string;
  revenueShare: number;
  thumbnailUrl?: string;
  destinationPath?: string;
}

export type DashboardAttentionSeverity = 'high' | 'medium' | 'low';

export interface DashboardAttentionItem {
  id: string;
  issue: string;
  context: string;
  severity: DashboardAttentionSeverity;
  actionLabel: string;
  actionPath?: string;
  actionDisabledReason?: string;
}

export interface CreatorDashboardSummary {
  metrics: DashboardMetric[];
  activities: DashboardActivity[];
  topProducts: DashboardTopProduct[];
  attentionItems: DashboardAttentionItem[];
}
