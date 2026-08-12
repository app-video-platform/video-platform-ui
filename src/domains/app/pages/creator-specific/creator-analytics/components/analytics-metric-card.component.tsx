import React from 'react';
import clsx from 'clsx';

import { AnalyticsMetric } from '../creator-analytics.types';
import { getTrendSymbol } from '../creator-analytics.utils';

interface AnalyticsMetricCardProps {
  metric: AnalyticsMetric;
}

const trendAriaLabel = {
  up: 'Up',
  down: 'Down',
  flat: 'No change',
};

const sentimentAriaLabel = {
  favorable: 'positive',
  unfavorable: 'needs attention',
  neutral: 'neutral',
};

const AnalyticsMetricCard: React.FC<AnalyticsMetricCardProps> = ({ metric }) => (
  <article className={clsx('analytics-metric-card', `analytics-metric-card--${metric.sentiment}`)}>
    <span className="analytics-metric-card__label">{metric.label}</span>
    <strong>{metric.value}</strong>
    <span
      className="analytics-metric-card__comparison"
      aria-label={`${trendAriaLabel[metric.direction]} ${sentimentAriaLabel[metric.sentiment]} trend: ${metric.comparison.replace(/^[↑↓—] /, '')}`}
    >
      <span aria-hidden="true">{getTrendSymbol(metric.direction)}</span>{' '}
      {metric.comparison.replace(/^[↑↓—] /, '')}
    </span>
  </article>
);

export default AnalyticsMetricCard;
