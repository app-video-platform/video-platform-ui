export type AnalyticsPeriod = '7d' | '30d' | '90d';
export type AnalyticsMetricKey = 'revenue' | 'orders';
export type AnalyticsDirection = 'up' | 'down' | 'flat';
export type AnalyticsSentiment = 'favorable' | 'unfavorable' | 'neutral';

export interface AnalyticsMetric {
  id: string;
  label: string;
  value: string;
  comparison: string;
  direction: AnalyticsDirection;
  sentiment: AnalyticsSentiment;
}

export interface AnalyticsSeriesPoint {
  label: string;
  revenue: number;
  orders: number;
  customers: number;
  newMemberships: number;
  cancelledMemberships: number;
  refunds: number;
  failedPayments: number;
}

export interface ProductAnalyticsItem {
  id: string;
  name: string;
  type: 'Course' | 'Download' | 'Consultation' | 'Membership';
  revenueCents: number;
  orders: number;
  share: number;
  thumbnailUrl?: string;
}

export interface CustomerGrowthSummary {
  totalCustomers: number;
  newCustomers: number;
  comparison: string;
}

export interface MembershipAnalyticsSummary {
  active: number;
  new: number;
  cancelled: number;
  churnRate: number;
  insight: string;
}

export interface PaymentHealthMetric {
  id: 'refund-rate' | 'failed-payments';
  label: string;
  value: string;
  comparison: string;
  direction: AnalyticsDirection;
  sentiment: AnalyticsSentiment;
}

export interface CreatorAnalyticsOverview {
  period: AnalyticsPeriod;
  periodLabel: string;
  previousPeriodLabel: string;
  metrics: AnalyticsMetric[];
  performance: {
    series: AnalyticsSeriesPoint[];
    revenueDelta: number;
    orderDelta: number;
  };
  products: ProductAnalyticsItem[];
  customerGrowth: {
    summary: CustomerGrowthSummary;
    series: AnalyticsSeriesPoint[];
  };
  memberships: {
    summary: MembershipAnalyticsSummary | null;
    series: AnalyticsSeriesPoint[];
  };
  paymentHealth: {
    metrics: PaymentHealthMetric[];
    series: AnalyticsSeriesPoint[];
  };
}

export interface CreatorAnalyticsOverviewQuery {
  period?: AnalyticsPeriod;
}
