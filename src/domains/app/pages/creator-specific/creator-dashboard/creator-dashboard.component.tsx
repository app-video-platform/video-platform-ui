import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectAuthUser } from 'core/store/auth-store';
import {
  fetchCreatorDashboardSummary,
  selectCreatorDashboardError,
  selectCreatorDashboardLoading,
  selectCreatorDashboardSummary,
} from 'core/store/dashboard-store';
import {
  AppDispatch,
  CreatorDashboardSummary,
  hasRole,
  UserRole,
} from 'core/api/models';
import {
  ActivityList,
  AttentionList,
  MetricCard,
  ProductPerformanceList,
} from './components';

import './creator-dashboard.styles.scss';

const getGreeting = (firstName?: string) => {
  const hour = new Date().getHours();
  const dayPart =
    hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  return `Good ${dayPart}, ${firstName || 'creator'}.`;
};

const unavailableDashboard: CreatorDashboardSummary = {
  metrics: [
    {
      id: 'revenue',
      label: 'Revenue',
      value: '',
      state: 'unavailable',
    },
    {
      id: 'sales',
      label: 'Sales',
      value: '',
      state: 'unavailable',
    },
    {
      id: 'customers',
      label: 'Customers',
      value: '',
      state: 'unavailable',
    },
    {
      id: 'active-memberships',
      label: 'Active memberships',
      value: '',
      state: 'unavailable',
    },
  ],
  activities: [],
  topProducts: [],
  attentionItems: [],
};

const CreatorDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const isCreator = hasRole(user?.roles, UserRole.CREATOR);
  const dashboard = useSelector(selectCreatorDashboardSummary);
  const isLoading = useSelector(selectCreatorDashboardLoading);
  const error = useSelector(selectCreatorDashboardError);

  useEffect(() => {
    if (isCreator) {
      dispatch(fetchCreatorDashboardSummary());
    }
  }, [dispatch, isCreator]);

  if (!isCreator) {
    return (
      <section className="creator-dashboard creator-dashboard__empty">
        <h1>Dashboard</h1>
        <p>Creator business tools are available when your active role is Creator.</p>
      </section>
    );
  }

  const dashboardSummary = error || !dashboard ? unavailableDashboard : dashboard;

  return (
    <div className="creator-dashboard">
      <header className="creator-dashboard__intro">
        <div>
          <h1>Dashboard</h1>
          <p>{getGreeting(user?.firstName)}</p>
        </div>
      </header>

      <section className="creator-dashboard__metrics" aria-label="Business metrics">
        {dashboardSummary.metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={isLoading && !dashboard ? { ...metric, state: 'loading' } : metric}
          />
        ))}
      </section>

      <div className="creator-dashboard__grid">
        <section className="dashboard-panel dashboard-panel__activity">
          <div className="dashboard-panel__header">
            <h2>Recent activity</h2>
          </div>
          {dashboardSummary.activities.length > 0 ? (
            <ActivityList items={dashboardSummary.activities} />
          ) : (
            <p className="dashboard-panel__empty">
              Activity will appear here once business events are available.
            </p>
          )}
        </section>

        <section className="dashboard-panel dashboard-panel__products">
          <div className="dashboard-panel__header">
            <h2>Top products</h2>
            <span>Revenue</span>
          </div>
          {dashboardSummary.topProducts.length > 0 ? (
            <ProductPerformanceList items={dashboardSummary.topProducts} />
          ) : (
            <p className="dashboard-panel__empty">
              Product performance is unavailable until revenue data exists.
            </p>
          )}
        </section>

        <section className="dashboard-panel dashboard-panel__attention">
          <div className="dashboard-panel__header">
            <h2>Needs attention</h2>
          </div>
          {dashboardSummary.attentionItems.length > 0 ? (
            <AttentionList items={dashboardSummary.attentionItems} />
          ) : (
            <p className="dashboard-panel__empty">
              No deterministic attention states are available yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default CreatorDashboard;
