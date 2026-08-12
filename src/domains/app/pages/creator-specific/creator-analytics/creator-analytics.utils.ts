import { SelectOption } from '@shared/ui';

import {
  AnalyticsDirection,
  AnalyticsMetric,
  AnalyticsPeriod,
  AnalyticsSentiment,
  AnalyticsSeriesPoint,
  PaymentHealthMetric,
  ProductAnalyticsItem,
} from './creator-analytics.types';

export const analyticsPeriodOptions: SelectOption[] = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
];

export const analyticsPeriodLabel: Record<AnalyticsPeriod, string> = {
  '7d': 'last 7 days',
  '30d': 'last 30 days',
  '90d': 'last 90 days',
};

export const previousPeriodLabel: Record<AnalyticsPeriod, string> = {
  '7d': 'previous 7 days',
  '30d': 'previous 30 days',
  '90d': 'previous 90 days',
};

export const formatAnalyticsMoney = (cents: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: Number.isInteger(cents / 100) ? 0 : 2,
  }).format(cents / 100);

export const formatAnalyticsCompactMoney = (cents: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(cents / 100);

export const formatAnalyticsNumber = (value: number) =>
  new Intl.NumberFormat('en-IE').format(value);

export const formatAnalyticsPercent = (value: number, digits = 1) =>
  `${value.toFixed(digits)}%`;

export const getTrendSymbol = (direction: AnalyticsDirection) => {
  if (direction === 'up') {
    return '↑';
  }
  if (direction === 'down') {
    return '↓';
  }
  return '—';
};

export const getDeltaPercent = (current: number, previous: number) => {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
};

export const getDirection = (delta: number): AnalyticsDirection => {
  if (delta > 0.05) {
    return 'up';
  }
  if (delta < -0.05) {
    return 'down';
  }
  return 'flat';
};

export const buildComparison = (
  delta: number,
  period: AnalyticsPeriod,
  unit: '%' | 'pp' | 'count' = '%',
) => {
  const direction = getDirection(delta);
  const symbol = getTrendSymbol(direction);
  const absolute = Math.abs(delta);
  const value =
    unit === 'count'
      ? `${Math.round(absolute)}`
      : `${absolute.toFixed(1)}${unit}`;

  return `${symbol} ${value} vs ${previousPeriodLabel[period]}`;
};

export const getSeriesTotal = (
  series: AnalyticsSeriesPoint[],
  key: keyof Pick<
    AnalyticsSeriesPoint,
    | 'revenue'
    | 'orders'
    | 'customers'
    | 'newMemberships'
    | 'cancelledMemberships'
    | 'refunds'
    | 'failedPayments'
  >,
) => series.reduce((total, item) => total + item[key], 0);

export const buildMetric = ({
  id,
  label,
  value,
  current,
  previous,
  period,
  favorableDirection = 'up',
}: {
  id: string;
  label: string;
  value: string;
  current: number;
  previous: number;
  period: AnalyticsPeriod;
  favorableDirection?: AnalyticsDirection;
}): AnalyticsMetric => {
  const delta = getDeltaPercent(current, previous);
  const direction = getDirection(delta);
  const sentiment: AnalyticsSentiment =
    direction === 'flat'
      ? 'neutral'
      : direction === favorableDirection
        ? 'favorable'
        : 'unfavorable';

  return {
    id,
    label,
    value,
    direction,
    sentiment,
    comparison: buildComparison(delta, period),
  };
};

export const getProductShare = (products: ProductAnalyticsItem[]) => {
  const totalRevenue = products.reduce(
    (total, product) => total + product.revenueCents,
    0,
  );

  if (totalRevenue === 0) {
    return products.map((product) => ({ ...product, share: 0 }));
  }

  return products.map((product) => ({
    ...product,
    share: Number(((product.revenueCents / totalRevenue) * 100).toFixed(1)),
  }));
};

export const buildPaymentMetric = ({
  id,
  label,
  value,
  delta,
  period,
  favorableDirection,
  unit,
}: {
  id: PaymentHealthMetric['id'];
  label: string;
  value: string;
  delta: number;
  period: AnalyticsPeriod;
  favorableDirection: AnalyticsDirection;
  unit: 'pp' | 'count';
}): PaymentHealthMetric => {
  const direction = getDirection(delta);
  const sentiment: AnalyticsSentiment =
    direction === 'flat'
      ? 'neutral'
      : direction === favorableDirection
        ? 'favorable'
        : 'unfavorable';

  return {
    id,
    label,
    value,
    comparison: buildComparison(delta, period, unit),
    direction,
    sentiment,
  };
};
