import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectAuthUser } from 'core/store/auth-store';
import {
  getAllProductsByUserId,
  getProductSummariesByOwner,
} from 'core/store/product-store';
import { AppDispatch, hasRole, UserRole } from 'core/api/models';
import {
  ActivityList,
  AttentionList,
  MetricCard,
  ProductPerformanceList,
} from './components';
import {
  CreatorDashboardFixture,
  getCreatorDashboardInspectionFixture,
} from './fixtures/dashboard-inspection-fixture';

import './creator-dashboard.styles.scss';

const getGreeting = (firstName?: string) => {
  const hour = new Date().getHours();
  const dayPart =
    hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  return `Good ${dayPart}, ${firstName || 'creator'}.`;
};

const unavailableDashboard: CreatorDashboardFixture = {
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
  const useInspectionData = process.env.REACT_APP_USE_MOCKS === 'true';

  useEffect(() => {
    if (isCreator && user && user.id) {
      dispatch(getProductSummariesByOwner(user.id));
      dispatch(getAllProductsByUserId(user.id));
    }
  }, [dispatch, isCreator, user]);

  const dashboard = useMemo(
    () =>
      useInspectionData
        ? getCreatorDashboardInspectionFixture()
        : unavailableDashboard,
    [useInspectionData],
  );

  if (!isCreator) {
    return (
      <section className="creator-dashboard creator-dashboard__empty">
        <h1>Dashboard</h1>
        <p>Creator business tools are available when your active role is Creator.</p>
      </section>
    );
  }

  return (
    <div className="creator-dashboard">
      <header className="creator-dashboard__intro">
        <div>
          <h1>Dashboard</h1>
          <p>{getGreeting(user?.firstName)}</p>
        </div>
      </header>

      <section className="creator-dashboard__metrics" aria-label="Business metrics">
        {dashboard.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <div className="creator-dashboard__grid">
        <section className="dashboard-panel dashboard-panel__activity">
          <div className="dashboard-panel__header">
            <h2>Recent activity</h2>
          </div>
          {dashboard.activities.length > 0 ? (
            <ActivityList items={dashboard.activities} />
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
          {dashboard.topProducts.length > 0 ? (
            <ProductPerformanceList items={dashboard.topProducts} />
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
          {dashboard.attentionItems.length > 0 ? (
            <AttentionList items={dashboard.attentionItems} />
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
