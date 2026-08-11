import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import {
  DashboardMetric,
  MetricDirection,
  MetricSentiment,
} from '../fixtures/dashboard-inspection-fixture';

import './metric-card.styles.scss';

const directionSymbol: Record<MetricDirection, string> = {
  up: '↑',
  down: '↓',
  flat: '—',
};

const directionAriaLabel: Record<MetricDirection, string> = {
  up: 'Up',
  down: 'Down',
  flat: 'No change',
};

const formatComparison = (
  direction: MetricDirection,
  comparison: string,
) => {
  const conciseComparison =
    direction === 'flat' ? comparison : comparison.replace(/^[+-]\s*/, '');

  return `${directionSymbol[direction]} ${conciseComparison}`;
};

const sentimentAriaLabel: Record<MetricSentiment, string> = {
  favorable: 'positive',
  unfavorable: 'needs attention',
  neutral: 'neutral',
};

const displayMetricLabel = (metric: DashboardMetric) =>
  metric.id === 'active-memberships' ? (
    <>
      <span className="metric-card__label-full">Active memberships</span>
      <span className="metric-card__label-short" aria-hidden="true">
        Memberships
      </span>
    </>
  ) : (
    metric.label
  );

interface MetricCardProps {
  metric: DashboardMetric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const state = metric.state ?? 'ready';
  const isInteractive = state === 'ready' && Boolean(metric.destinationPath);

  if (state === 'loading') {
    return (
      <article className="metric-card metric-card__loading" aria-busy="true">
        <span className="metric-card__label" aria-label={metric.label}>
          {displayMetricLabel(metric)}
        </span>
        <span className="metric-card__skeleton metric-card__skeleton-value" />
        <span className="metric-card__skeleton metric-card__skeleton-meta" />
      </article>
    );
  }

  if (state === 'unavailable') {
    return (
      <article className="metric-card metric-card__unavailable">
        <span className="metric-card__label" aria-label={metric.label}>
          {displayMetricLabel(metric)}
        </span>
        <strong className="metric-card__value">Unavailable</strong>
        <span className="metric-card__comparison">
          More business data is needed.
        </span>
      </article>
    );
  }

  const direction = metric.direction ?? 'flat';
  const sentiment = metric.sentiment ?? 'neutral';
  const comparison = metric.comparison
    ? formatComparison(direction, metric.comparison)
    : '';

  const content = (
    <>
      <span className="metric-card__label" aria-label={metric.label}>
        {displayMetricLabel(metric)}
      </span>
      <strong className="metric-card__value">{metric.value}</strong>
      {metric.comparison && (
        <span className="metric-card__comparison">
          <span className="metric-card__trend-mark" aria-hidden="true" />
          <span
            className="metric-card__comparison-text"
            aria-label={`${directionAriaLabel[direction]} ${sentimentAriaLabel[sentiment]} trend: ${metric.comparison}`}
          >
            {comparison}
          </span>
        </span>
      )}
    </>
  );

  const className = clsx(
    'metric-card',
    `metric-card__${sentiment}`,
    isInteractive && 'metric-card__interactive',
  );

  if (isInteractive && metric.destinationPath) {
    return (
      <Link
        className={className}
        to={metric.destinationPath}
        aria-label={`View ${metric.label} details`}
      >
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
};

export default MetricCard;
