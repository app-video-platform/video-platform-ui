import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartContainer, ChartEmptyState, ChartTooltip } from '@shared/ui';

import {
  AnalyticsMetricKey,
  AnalyticsPeriod,
  AnalyticsSeriesPoint,
} from 'core/api/models';
import {
  formatAnalyticsCompactMoney,
  formatAnalyticsNumber,
} from '../creator-analytics.utils';

interface PerformanceChartProps {
  data: AnalyticsSeriesPoint[];
  mode: AnalyticsMetricKey;
  period: AnalyticsPeriod;
}

const getTickInterval = (period: AnalyticsPeriod) => {
  if (period === '7d') {
    return 0;
  }
  if (period === '30d') {
    return 5;
  }
  return 1;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  mode,
  period,
}) => {
  if (data.length === 0) {
    return (
      <ChartEmptyState
        title="No performance data yet"
        message="Performance trends will appear once analytics data is available."
      />
    );
  }

  const interval = getTickInterval(period);
  const gridColor = 'var(--chart-grid)';
  const tickColor = 'var(--chart-tick)';

  if (mode === 'orders') {
    return (
      <ChartContainer
        title="Orders performance chart"
        description="Bar chart showing orders over the selected period."
        height={318}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} accessibilityLayer margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis dataKey="label" interval={interval} tickLine={false} axisLine={false} tick={{ fill: tickColor }} />
            <YAxis width={36} tickLine={false} axisLine={false} tick={{ fill: tickColor }} />
            <Tooltip content={<ChartTooltip valueFormatter={(value) => formatAnalyticsNumber(Number(value))} />} />
            <Bar
              dataKey="orders"
              name="Orders"
              fill="var(--chart-series-2)"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      title="Revenue performance chart"
      description="Area chart showing revenue over the selected period."
      height={318}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} accessibilityLayer margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="analyticsRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-series-1)" stopOpacity={0.32} />
              <stop offset="95%" stopColor="var(--chart-series-1)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={gridColor} />
          <XAxis dataKey="label" interval={interval} tickLine={false} axisLine={false} tick={{ fill: tickColor }} />
          <YAxis
            width={48}
            tickLine={false}
            axisLine={false}
            tick={{ fill: tickColor }}
            tickFormatter={(value) => formatAnalyticsCompactMoney(Number(value))}
          />
          <Tooltip content={<ChartTooltip valueFormatter={(value) => formatAnalyticsCompactMoney(Number(value))} />} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="var(--chart-series-1)"
            strokeWidth={3}
            fill="url(#analyticsRevenueFill)"
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PerformanceChart;
