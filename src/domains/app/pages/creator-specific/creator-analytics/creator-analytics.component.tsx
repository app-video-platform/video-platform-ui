import React, { useEffect, useState } from 'react';
import { MdOutlineCalendarToday } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Select } from '@shared/ui';
import { AnalyticsMetricKey, AnalyticsPeriod, AppDispatch } from 'core/api/models';
import {
  fetchCreatorAnalyticsOverview,
  selectAnalyticsError,
  selectAnalyticsLoading,
  selectAnalyticsOverview,
} from 'core/store/analytics-store';

import {
  AnalyticsMetricCard,
  CustomerGrowthChart,
  MembershipMovementChart,
  PaymentHealthSection,
  PerformanceChart,
  ProductPerformanceSection,
} from './components';
import {
  analyticsPeriodOptions,
  formatAnalyticsNumber,
  formatAnalyticsPercent,
} from './creator-analytics.utils';

import './creator-analytics.styles.scss';

const performanceModeOptions: { label: string; value: AnalyticsMetricKey }[] = [
  { label: 'Revenue', value: 'revenue' },
  { label: 'Orders', value: 'orders' },
];

const CreatorAnalytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d');
  const [performanceMode, setPerformanceMode] =
    useState<AnalyticsMetricKey>('revenue');
  const data = useSelector(selectAnalyticsOverview);
  const isLoading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);

  useEffect(() => {
    dispatch(fetchCreatorAnalyticsOverview({ period }));
  }, [dispatch, period]);

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(event.target.value as AnalyticsPeriod);
  };

  if (isLoading && !data) {
    return (
      <div className="creator-analytics">
        <header className="creator-analytics__intro">
          <div>
            <h1>Analytics</h1>
            <p>Understand how your business is performing over time.</p>
          </div>
          <Select
            name="analytics-period"
            value={period}
            options={analyticsPeriodOptions}
            onChange={handlePeriodChange}
            customClassName="creator-analytics__period"
            prefixIcon={MdOutlineCalendarToday}
            aria-label="Select analytics date range"
          />
        </header>

        <section className="analytics-state" role="status" aria-busy="true">
          <h2>Loading analytics</h2>
          <p>Fetching the selected Creator analytics overview.</p>
        </section>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="creator-analytics">
        <header className="creator-analytics__intro">
          <div>
            <h1>Analytics</h1>
            <p>Understand how your business is performing over time.</p>
          </div>
          <Select
            name="analytics-period"
            value={period}
            options={analyticsPeriodOptions}
            onChange={handlePeriodChange}
            customClassName="creator-analytics__period"
            prefixIcon={MdOutlineCalendarToday}
            aria-label="Select analytics date range"
          />
        </header>

        <section className="analytics-state" role="status">
          <h2>Analytics data is not available yet</h2>
          <p>
            Trends will appear here once revenue, order, customer, membership,
            and payment analytics APIs are connected.
          </p>
        </section>
      </div>
    );
  }

  const performanceDelta =
    performanceMode === 'revenue'
      ? data.performance.revenueDelta
      : data.performance.orderDelta;
  const performanceLabel = performanceMode === 'revenue' ? 'Revenue' : 'Orders';
  const performanceDirection =
    performanceDelta > 0 ? 'increased' : performanceDelta < 0 ? 'decreased' : 'held steady';

  return (
    <div className="creator-analytics">
      <header className="creator-analytics__intro">
        <div>
          <h1>Analytics</h1>
          <p>Understand how your business is performing over time.</p>
        </div>
        <Select
          name="analytics-period"
          value={period}
          options={analyticsPeriodOptions}
          onChange={handlePeriodChange}
          customClassName="creator-analytics__period"
          prefixIcon={MdOutlineCalendarToday}
          aria-label="Select analytics date range"
        />
      </header>

      <section className="analytics-metrics" aria-label="Business metrics">
        {data.metrics.map((metric) => (
          <AnalyticsMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <div className="analytics-primary-grid">
        <section className="analytics-panel analytics-panel--performance">
          <div className="analytics-panel__header">
            <div>
              <h2>Performance</h2>
              <p>{performanceLabel} over the {data.periodLabel}.</p>
            </div>
            <div className="analytics-toggle" role="group" aria-label="Performance metric">
              {performanceModeOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={performanceMode === option.value ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setPerformanceMode(option.value)}
                  aria-pressed={performanceMode === option.value}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <PerformanceChart
            data={data.performance.series}
            mode={performanceMode}
            period={period}
          />
          <p className="analytics-insight">
            {performanceLabel} {performanceDirection}{' '}
            {formatAnalyticsPercent(Math.abs(performanceDelta))} compared with the{' '}
            {data.previousPeriodLabel}.
          </p>
        </section>

        <section className="analytics-panel analytics-panel--products">
          <div className="analytics-panel__header">
            <div>
              <h2>Product performance</h2>
              <p>Revenue, orders, and share by product.</p>
            </div>
          </div>
          <ProductPerformanceSection products={data.products} />
        </section>
      </div>

      <div className="analytics-secondary-grid">
        <section className="analytics-panel analytics-panel--customers">
          <div className="analytics-panel__header">
            <div>
              <h2>Customer growth</h2>
              <p>
                {formatAnalyticsNumber(data.customerGrowth.summary.totalCustomers)} total
                customers · +{formatAnalyticsNumber(data.customerGrowth.summary.newCustomers)} this
                period
              </p>
            </div>
          </div>
          <CustomerGrowthChart
            data={data.customerGrowth.series}
            period={period}
          />
          <p className="analytics-insight">
            You gained {formatAnalyticsNumber(data.customerGrowth.summary.newCustomers)} new
            customers in the {data.periodLabel}.
          </p>
        </section>

        <section className="analytics-panel analytics-panel--memberships">
          <div className="analytics-panel__header">
            <div>
              <h2>Memberships</h2>
              <p>New and cancelled memberships over the selected period.</p>
            </div>
          </div>
          {data.memberships.summary ? (
            <>
              <div className="membership-summary" aria-label="Membership summary values">
                <span>
                  <small>Active</small>
                  <strong>{formatAnalyticsNumber(data.memberships.summary.active)}</strong>
                </span>
                <span>
                  <small>New</small>
                  <strong>{formatAnalyticsNumber(data.memberships.summary.new)}</strong>
                </span>
                <span>
                  <small>Cancelled</small>
                  <strong>{formatAnalyticsNumber(data.memberships.summary.cancelled)}</strong>
                </span>
                <span>
                  <small>Churn rate</small>
                  <strong>{formatAnalyticsPercent(data.memberships.summary.churnRate)}</strong>
                </span>
              </div>
              <MembershipMovementChart
                data={data.memberships.series}
                period={period}
              />
              <p className="analytics-insight">{data.memberships.summary.insight}</p>
            </>
          ) : (
            <MembershipMovementChart data={[]} period={period} />
          )}
        </section>

        <section className="analytics-panel analytics-panel--payments">
          <div className="analytics-panel__header">
            <div>
              <h2>Payment health</h2>
              <p>Refund and failed-payment trends.</p>
            </div>
          </div>
          <PaymentHealthSection
            metrics={data.paymentHealth.metrics}
            series={data.paymentHealth.series}
          />
          <p className="analytics-insight">
            Payment health is based on aggregate refund and failed-payment movement,
            not individual sales events.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CreatorAnalytics;
