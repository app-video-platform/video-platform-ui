import React from 'react';
import clsx from 'clsx';

import { CustomerRelationshipStatus } from 'core/api/models';
import { relationshipLabel } from './creator-customers.utils';

interface CustomerStatusBadgeProps {
  status: CustomerRelationshipStatus;
}

const CustomerStatusBadge: React.FC<CustomerStatusBadgeProps> = ({ status }) => (
  <span className={clsx('customer-status-badge', `customer-status-badge--${status}`)}>
    {relationshipLabel[status]}
  </span>
);

export default CustomerStatusBadge;
