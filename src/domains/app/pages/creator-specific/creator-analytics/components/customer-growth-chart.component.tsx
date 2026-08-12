import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartContainer, ChartEmptyState, ChartTooltip } from '@shared/ui';

import { AnalyticsPeriod, AnalyticsSeriesPoint } from 'core/api/models';
import { formatAnalyticsNumber } from '../creator-analytics.utils';

interface CustomerGrowthChartProps {
  data: AnalyticsSeriesPoint[];
  period: AnalyticsPeriod;
}

const CustomerGrowthChart: React.FC<CustomerGrowthChartProps> = ({ data, period }) => {
  if (data.length === 0) {
    return (
      <ChartEmptyState
        title="No customer growth data yet"
        message="New customer trends will appear once customer analytics are available."
      />
    );
  }

  return (
    <ChartContainer
      title="Customer growth chart"
      description="Area chart showing new customers over the selected period."
      height={258}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} accessibilityLayer margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="analyticsCustomersFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-series-3)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-series-3)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis
            dataKey="label"
            interval={period === '7d' ? 0 : period === '30d' ? 6 : 1}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--chart-tick)' }}
          />
          <YAxis width={34} tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)' }} />
          <Tooltip content={<ChartTooltip valueFormatter={(value) => formatAnalyticsNumber(Number(value))} />} />
          <Area
            type="monotone"
            dataKey="customers"
            name="New customers"
            stroke="var(--chart-series-3)"
            strokeWidth={3}
            fill="url(#analyticsCustomersFill)"
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CustomerGrowthChart;
