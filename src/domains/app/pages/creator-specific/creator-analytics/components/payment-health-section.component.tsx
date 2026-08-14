import React from 'react';
import clsx from 'clsx';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import { ChartTooltip } from '@shared/ui';

import { AnalyticsSeriesPoint, PaymentHealthMetric } from 'core/api/models';
import { formatAnalyticsNumber, getTrendSymbol } from '../creator-analytics.utils';

interface PaymentHealthSectionProps {
  metrics: PaymentHealthMetric[];
  series: AnalyticsSeriesPoint[];
}

const PaymentHealthSection: React.FC<PaymentHealthSectionProps> = ({
  metrics,
  series,
}) => (
  <div className="payment-health">
    {metrics.map((metric) => (
      <article
        key={metric.id}
        className={clsx('payment-health-card', `payment-health-card--${metric.sentiment}`)}
      >
        <span>{metric.label}</span>
        <strong>{metric.value}</strong>
        <small>
          <span aria-hidden="true">{getTrendSymbol(metric.direction)}</span>{' '}
          {metric.comparison.replace(/^[↑↓—] /, '')}
        </small>
      </article>
    ))}
    {series.length > 0 && (
      <div
        className="payment-health__mini-chart"
        role="img"
        aria-label="Mini trend chart for refunds and failed payments"
      >
        <ResponsiveContainer width="100%" height={82}>
          <LineChart
            data={series}
            accessibilityLayer
            margin={{ top: 8, right: 8, left: 8, bottom: 2 }}
          >
            <XAxis dataKey="label" hide />
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(value) => formatAnalyticsNumber(Number(value))}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="refunds"
              name="Refunds"
              stroke="var(--chart-series-2)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="failedPayments"
              name="Failed payments"
              stroke="var(--chart-series-negative)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

export default PaymentHealthSection;
