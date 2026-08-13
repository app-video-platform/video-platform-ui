import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { HiArrowLeft } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';

import { Icon } from '@shared/ui';
import { getCssVar } from '@shared/utils';
import { AppDispatch } from 'core/api/models';
import {
  fetchCreatorCustomerDetail,
  selectCreatorCustomerDetailError,
  selectCreatorCustomerDetailLoading,
  selectCurrentCreatorCustomer,
} from 'core/store/customers-store';

import CustomerAvatar from './customer-avatar.component';
import CustomerStatusBadge from './customer-status-badge.component';
import {
  accessSourceLabel,
  accessStatusLabel,
  formatCustomerDate,
  formatCustomerMoney,
  formatCustomerShortDate,
  getCustomerDisplayName,
  membershipLabel,
  purchaseStatusLabel,
  relationshipLabel,
} from './creator-customers.utils';

import './customers.styles.scss';

type CustomerDetailTab = 'overview' | 'purchases' | 'access' | 'notes';

const tabs: Array<{ id: CustomerDetailTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'purchases', label: 'Purchases' },
  { id: 'access', label: 'Access' },
  { id: 'notes', label: 'Notes' },
];

const CustomerDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customerId } = useParams();
  const customer = useSelector(selectCurrentCreatorCustomer);
  const loading = useSelector(selectCreatorCustomerDetailLoading);
  const error = useSelector(selectCreatorCustomerDetailError);
  const [activeTab, setActiveTab] = useState<CustomerDetailTab>('overview');

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCreatorCustomerDetail(customerId));
    }
  }, [customerId, dispatch]);

  if (loading && !customer) {
    return (
      <div className="customer-detail-page">
        <Link to="/app/customers" className="customer-detail-back">
          <Icon icon={HiArrowLeft} size={18} color={getCssVar('--brand-primary')} />
          Back to Customers
        </Link>
        <div className="customers-state" role="status">
          <h2>Loading customer</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-detail-page">
        <Link to="/app/customers" className="customer-detail-back">
          <Icon icon={HiArrowLeft} size={18} color={getCssVar('--brand-primary')} />
          Back to Customers
        </Link>
        <div className="customers-state" role="status">
          <h2>Customer profile data is not available yet</h2>
          <p>
            Customer details will appear once customer, purchase, access, and notes
            APIs are connected.
          </p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="customer-detail-page">
        <Link to="/app/customers" className="customer-detail-back">
          <Icon icon={HiArrowLeft} size={18} color={getCssVar('--brand-primary')} />
          Back to Customers
        </Link>
        <div className="customers-state">
          <h2>Customer not found</h2>
          <p>This customer is not available.</p>
        </div>
      </div>
    );
  }

  const displayName = getCustomerDisplayName(customer);
  const activeProductsLabel = `${customer.activeAccessCount} ${
    customer.activeAccessCount === 1 ? 'product' : 'products'
  }`;

  const renderOverview = () => (
    <div className="customer-detail-grid">
      <section className="customer-detail-panel">
        <h2>About</h2>
        <dl className="customer-definition-list">
          <div>
            <dt>Email</dt>
            <dd>{customer.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{customer.phone || 'Unavailable'}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{customer.location || 'Unavailable'}</dd>
          </div>
          <div>
            <dt>Language</dt>
            <dd>{customer.language || 'Unavailable'}</dd>
          </div>
          <div>
            <dt>Timezone</dt>
            <dd>{customer.timezone || 'Unavailable'}</dd>
          </div>
          <div>
            <dt>Customer since</dt>
            <dd>{formatCustomerDate(customer.customerSince)}</dd>
          </div>
        </dl>
      </section>

      <section className="customer-detail-panel">
        <h2>Relationship</h2>
        <dl className="customer-definition-list">
          <div>
            <dt>Status</dt>
            <dd>{relationshipLabel[customer.relationshipStatus]}</dd>
          </div>
          <div>
            <dt>Membership</dt>
            <dd>{membershipLabel[customer.membershipState]}</dd>
          </div>
          <div>
            <dt>Products</dt>
            <dd>
              {customer.products.length > 0
                ? customer.products.map((product) => product.name).join(', ')
                : 'No products yet'}
            </dd>
          </div>
          <div>
            <dt>Tags</dt>
            <dd>
              {customer.tags && customer.tags.length > 0 ? (
                <span className="customer-tags">
                  {customer.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </span>
              ) : (
                'No tags'
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="customer-detail-panel customer-detail-panel--wide">
        <h2>Recent activity</h2>
        {customer.activity.length > 0 ? (
          <div className="customer-activity-list">
            {customer.activity.map((item) => (
              <article key={item.id} className="customer-activity-list__item">
                <div>
                  <h3>{item.label}</h3>
                  {item.context && <p>{item.context}</p>}
                </div>
                <time>{formatCustomerShortDate(item.occurredAt)}</time>
              </article>
            ))}
          </div>
        ) : (
          <p className="customer-empty-copy">
            No customer-specific activity is available yet.
          </p>
        )}
      </section>
    </div>
  );

  const renderPurchases = () => (
    <section className="customer-detail-panel">
      <h2>Purchases</h2>
      {customer.purchases.length > 0 ? (
        <div className="customer-record-list">
          {customer.purchases.map((purchase) => (
            <article className="customer-record-row" key={purchase.id}>
              <div>
                <h3>{purchase.productName}</h3>
                <span>{purchase.productType}</span>
              </div>
              <span>{formatCustomerShortDate(purchase.purchasedAt)}</span>
              <strong>{formatCustomerMoney(purchase.amountCents)}</strong>
              <span
                className={clsx(
                  'customer-record-status',
                  `customer-record-status--${purchase.status}`,
                )}
              >
                {purchaseStatusLabel[purchase.status]}
              </span>
              <span>{purchase.paymentModel}</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="customer-empty-copy">
          No purchase history is available for this customer.
        </p>
      )}
    </section>
  );

  const renderAccess = () => (
    <section className="customer-detail-panel">
      <h2>Access</h2>
      {customer.access.length > 0 ? (
        <div className="customer-record-list">
          {customer.access.map((access) => (
            <article className="customer-record-row" key={access.id}>
              <div>
                <h3>{access.productName}</h3>
                <span>{access.productType}</span>
              </div>
              <span
                className={clsx(
                  'customer-record-status',
                  `customer-record-status--${access.status}`,
                )}
              >
                {accessStatusLabel[access.status]}
              </span>
              <span>{accessSourceLabel[access.source]}</span>
              <span>Granted {formatCustomerShortDate(access.grantedAt)}</span>
              <span>
                {access.expiresAt
                  ? `Ends ${formatCustomerShortDate(access.expiresAt)}`
                  : 'No end date'}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <p className="customer-empty-copy">
          No active or historical access records are available for this customer.
        </p>
      )}
    </section>
  );

  const renderNotes = () => (
    <section className="customer-detail-panel">
      <h2>Notes</h2>
      {customer.notes && customer.notes.length > 0 ? (
        <div className="customer-notes-list">
          {customer.notes.map((note) => (
            <article key={note.id} className="customer-note">
              <p>{note.body}</p>
              <span>
                {note.author} · {formatCustomerShortDate(note.createdAt)}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <p className="customer-empty-copy">
          Internal notes are not connected to a production persistence API yet.
        </p>
      )}
    </section>
  );

  const activeContent: Record<CustomerDetailTab, React.ReactNode> = {
    overview: renderOverview(),
    purchases: renderPurchases(),
    access: renderAccess(),
    notes: renderNotes(),
  };

  return (
    <div className="customer-detail-page">
      <Link to="/app/customers" className="customer-detail-back">
        <Icon icon={HiArrowLeft} size={18} color={getCssVar('--brand-primary')} />
        Back to Customers
      </Link>

      <header className="customer-detail-header">
        <CustomerAvatar customer={customer} large />
        <div className="customer-detail-header__identity">
          <div className="customer-detail-header__title-row">
            <h1>{displayName}</h1>
            <CustomerStatusBadge status={customer.relationshipStatus} />
          </div>
          <p>{customer.email}</p>
          <span>
            Customer since {formatCustomerDate(customer.customerSince)}
          </span>
        </div>
      </header>

      <section className="customer-summary-metrics" aria-label="Customer summary">
        <article>
          <span>Total spent</span>
          <strong>{formatCustomerMoney(customer.totalSpendCents)}</strong>
        </article>
        <article>
          <span>Orders</span>
          <strong>{customer.ordersCount}</strong>
        </article>
        <article>
          <span>Active access</span>
          <strong>{activeProductsLabel}</strong>
        </article>
        <article>
          <span>Membership</span>
          <strong>{membershipLabel[customer.membershipState]}</strong>
        </article>
      </section>

      <div className="customer-detail-tabs">
        <div role="tablist" aria-label="Customer detail sections">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`customer-tab-panel-${tab.id}`}
                id={`customer-tab-${tab.id}`}
                className={clsx('customer-detail-tab', {
                  'customer-detail-tab--active': isActive,
                })}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <section
          id={`customer-tab-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`customer-tab-${activeTab}`}
          className="customer-detail-tab-panel"
        >
          {activeContent[activeTab]}
        </section>
      </div>
    </div>
  );
};

export default CustomerDetail;
