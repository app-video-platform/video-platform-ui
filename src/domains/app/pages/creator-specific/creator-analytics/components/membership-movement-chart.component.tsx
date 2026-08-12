import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartContainer, ChartEmptyState, ChartLegend, ChartTooltip } from '@shared/ui';

import { AnalyticsPeriod, AnalyticsSeriesPoint } from '../creator-analytics.types';
import { formatAnalyticsNumber } from '../creator-analytics.utils';

interface MembershipMovementChartProps {
  data: AnalyticsSeriesPoint[];
  period: AnalyticsPeriod;
}

const MembershipMovementChart: React.FC<MembershipMovementChartProps> = ({ data, period }) => {
  if (data.length === 0) {
    return (
      <ChartEmptyState
        title="No membership data yet"
        message="Membership analytics can be omitted when no membership products exist."
      />
    );
  }

  return (
    <div className="analytics-chart-with-legend">
      <ChartLegend
        items={[
          { label: 'New memberships', color: 'var(--chart-series-positive)', marker: 'bar' },
          { label: 'Cancelled memberships', color: 'var(--chart-series-negative)', marker: 'bar' },
        ]}
      />
      <ChartContainer
        title="Membership movement chart"
        description="Grouped bars comparing new and cancelled memberships."
        height={246}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            accessibilityLayer
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis
              dataKey="label"
              interval={period === '7d' ? 0 : period === '30d' ? 6 : 1}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--chart-tick)' }}
            />
            <YAxis width={34} tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)' }} />
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(value) => formatAnalyticsNumber(Number(value))}
                />
              }
            />
            <Bar
              dataKey="newMemberships"
              name="New memberships"
              fill="var(--chart-series-positive)"
              radius={[5, 5, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="cancelledMemberships"
              name="Cancelled memberships"
              fill="var(--chart-series-negative)"
              radius={[5, 5, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default MembershipMovementChart;
