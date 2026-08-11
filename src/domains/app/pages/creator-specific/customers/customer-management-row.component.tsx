import React from 'react';
import { Link } from 'react-router-dom';

import { CreatorCustomer } from './creator-customers.types';
import CustomerAvatar from './customer-avatar.component';
import CustomerStatusBadge from './customer-status-badge.component';
import {
  formatCustomerMoney,
  getCustomerDisplayName,
  getProductSummaryLabel,
} from './creator-customers.utils';

interface CustomerManagementRowProps {
  customer: CreatorCustomer;
}

const CustomerManagementRow: React.FC<CustomerManagementRowProps> = ({
  customer,
}) => {
  const productSummary = getProductSummaryLabel(customer);
  const displayName = getCustomerDisplayName(customer);

  return (
    <article className="customers-management-row">
      <div className="customers-management-row__customer">
        <Link
          to={`/app/customers/${customer.id}`}
          className="customers-management-row__identity"
          aria-label={`Open ${displayName} customer profile`}
        >
          <CustomerAvatar customer={customer} />
          <span className="customers-management-row__title-group">
            <span className="customers-management-row__name">{displayName}</span>
            <span className="customers-management-row__email">{customer.email}</span>
          </span>
        </Link>
      </div>

      <div className="customers-management-row__status">
        <CustomerStatusBadge status={customer.relationshipStatus} />
      </div>

      <div className="customers-management-row__products">
        <strong>{productSummary.count}</strong>
        <span>{productSummary.detail}</span>
      </div>

      <div className="customers-management-row__spend">
        {formatCustomerMoney(customer.totalSpendCents)}
      </div>

      <div className="customers-management-row__activity">
        <span className="customers-management-row__activity-prefix">
          Last activity{' '}
        </span>
        {customer.lastActivityLabel || 'Unavailable'}
      </div>
    </article>
  );
};

export default CustomerManagementRow;
