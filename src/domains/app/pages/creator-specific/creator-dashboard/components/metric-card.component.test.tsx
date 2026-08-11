import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import MetricCard from './metric-card.component';

jest.mock('@shared/ui', () => ({
  __esModule: true,
  GalIcon: () => <span data-testid="trend-icon" />,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe('<MetricCard />', () => {
  it('keeps trend direction and sentiment independent', () => {
    render(
      <MetricCard
        metric={{
          id: 'churn',
          label: 'Churn',
          value: '12%',
          comparison: '+4% vs last month',
          direction: 'up',
          sentiment: 'unfavorable',
        }}
      />,
    );

    expect(screen.getByText('Churn')).toBeInTheDocument();
    expect(screen.getByText('↑ 4% vs last month')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Up needs attention trend: +4% vs last month'),
    ).toBeInTheDocument();
  });

  it('renders an unavailable state without trend language', () => {
    render(
      <MetricCard
        metric={{
          id: 'customers',
          label: 'Customers',
          value: '',
          state: 'unavailable',
        }}
      />,
    );

    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(screen.queryByText(/favorable/i)).toBeNull();
  });

  it('uses link semantics only when a metric has a destination', () => {
    render(
      <>
        <MetricCard
          metric={{
            id: 'revenue',
            label: 'Revenue',
            value: '€18,420',
            comparison: '+12% vs last 30 days',
            direction: 'up',
            sentiment: 'favorable',
            destinationPath: '/app/sales',
          }}
        />
        <MetricCard
          metric={{
            id: 'customers',
            label: 'Customers',
            value: '1,284',
            comparison: 'No prior period',
            direction: 'flat',
            sentiment: 'neutral',
          }}
        />
      </>,
    );

    expect(screen.getByRole('link', { name: /view revenue details/i })).toHaveAttribute(
      'href',
      '/app/sales',
    );
    expect(screen.queryByRole('link', { name: /view customers details/i })).toBeNull();
  });
});
