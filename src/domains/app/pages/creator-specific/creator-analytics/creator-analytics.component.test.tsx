/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import httpClient from 'core/api/http-client';
import analyticsReducer from 'core/store/analytics-store/analytics.slice';
import { registerCreatorAnalyticsTestMocks } from 'core/api/test-fixtures/creator-analytics-http.mock';
import CreatorAnalytics from './creator-analytics.component';
import { ProductPerformanceSection } from './components';

jest.mock('recharts', () => {
  interface MockChartProps {
    children?: React.ReactNode;
    data?: unknown[];
    accessibilityLayer?: boolean;
  }

  const Chart = ({ children, data, accessibilityLayer }: MockChartProps) => (
    <div data-testid="mock-chart" data-accessibility-layer={String(accessibilityLayer)}>
      <span>{`${data?.length ?? 0} chart points`}</span>
      {children}
    </div>
  );
  const Primitive = ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  );

  return {
    Area: Primitive,
    AreaChart: Chart,
    Bar: Primitive,
    BarChart: Chart,
    CartesianGrid: Primitive,
    Line: Primitive,
    LineChart: Chart,
    ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Tooltip: Primitive,
    XAxis: Primitive,
    YAxis: Primitive,
  };
});

const renderAnalytics = () => {
  const testStore = configureStore({
    reducer: {
      analytics: analyticsReducer,
    },
  });

  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/app/analytics']}>
        <Routes>
          <Route path="/app/analytics" element={<CreatorAnalytics />} />
          <Route
            path="/app/products/edit/:productId"
            element={<div>Product workspace route</div>}
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('Creator Analytics', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    registerCreatorAnalyticsTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
  });

  it('renders the Analytics route with metrics and default 30-day data', async () => {
    renderAnalytics();

    expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument();
    expect(
      screen.getByText('Understand how your business is performing over time.'),
    ).toBeInTheDocument();
    expect(await screen.findByText('€3,429')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Performance' })).toBeInTheDocument();
    expect(screen.getAllByText('48').length).toBeGreaterThan(0);
    expect(screen.getByText('1,284')).toBeInTheDocument();
    expect(screen.getAllByText('318').length).toBeGreaterThan(0);
  });

  it('updates visible data when the period changes', async () => {
    renderAnalytics();

    await screen.findByText('€3,429');
    fireEvent.change(screen.getByLabelText('Select analytics date range'), {
      target: { value: '7d' },
    });

    expect(await screen.findByText('€958')).toBeInTheDocument();
    expect(screen.getByText(/Revenue over the last 7 days/i)).toBeInTheDocument();
    expect(screen.getAllByText('7 chart points').length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText('Select analytics date range'), {
      target: { value: '90d' },
    });

    expect(
      await screen.findByText(/Revenue over the last 90 days/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText('13 chart points').length).toBeGreaterThan(0);
  });

  it('supports Revenue and Orders performance modes with keyboard-accessible buttons', async () => {
    renderAnalytics();

    await screen.findByText('€3,429');
    const toggle = screen.getByRole('group', { name: 'Performance metric' });
    expect(within(toggle).getByRole('button', { name: 'Revenue' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(within(toggle).getByRole('button', { name: 'Orders' }));

    expect(within(toggle).getByRole('button', { name: 'Orders' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText(/Orders over the last 30 days/i)).toBeInTheDocument();
    expect(screen.getByText(/Orders increased/i)).toBeInTheDocument();
  });

  it('renders product ranking with accessible numeric values and links', async () => {
    renderAnalytics();

    await screen.findByText('€3,429');
    const section = screen.getByRole('heading', { name: 'Product performance' })
      .parentElement?.parentElement;
    expect(section).toBeTruthy();
    expect(screen.getByText('Creator Product Growth System')).toBeInTheDocument();
    expect(screen.getByText('The Very Long Product Operations Template Pack for Launch Teams')).toBeInTheDocument();
    expect(screen.getByText('€1,192')).toBeInTheDocument();
    expect(screen.getAllByText('8').length).toBeGreaterThan(0);
    expect(screen.getByText('34.8%')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Open Creator Product Growth System product workspace',
      }),
    ).toHaveAttribute('href', '/app/products/edit/prod-course-growth');
  });

  it('renders customer growth, membership health, and payment health summaries', async () => {
    renderAnalytics();

    await screen.findByText('€3,429');
    expect(screen.getByRole('heading', { name: 'Customer growth' })).toBeInTheDocument();
    expect(screen.getByText(/You gained 48 new customers/i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Memberships' })).toBeInTheDocument();
    expect(screen.getByText('Churn rate')).toBeInTheDocument();
    expect(screen.getByText('You\'re gaining more members than you\'re losing.')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Payment health' })).toBeInTheDocument();
    expect(screen.getByText('Refund rate')).toBeInTheDocument();
    expect(screen.getByText('Failed payments')).toBeInTheDocument();
  });

  it('renders honest unavailable state when the backend contract is missing', async () => {
    mock.resetHandlers();
    mock.onAny().reply(404);
    renderAnalytics();

    expect(
      await screen.findByText('Analytics data is not available yet'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Creator Product Growth System')).toBeNull();
  });

  it('renders product empty state without a broken ranking', () => {
    render(
      <MemoryRouter>
        <ProductPerformanceSection products={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText('No product performance data yet')).toBeInTheDocument();
  });

  it('keeps chart text summaries available outside the SVG visual', async () => {
    renderAnalytics();

    await screen.findByText('€3,429');
    expect(
      screen.getByText(/Revenue increased .* compared with the previous 30 days/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Payment health is based on aggregate refund and failed-payment movement/i),
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId('mock-chart')[0],
    ).toHaveAttribute('data-accessibility-layer', 'true');
  });
});
