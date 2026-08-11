import React from 'react';

import { CreatorCustomer } from './creator-customers.types';
import { getCustomerDisplayName, getCustomerInitials } from './creator-customers.utils';

interface CustomerAvatarProps {
  customer: CreatorCustomer;
  large?: boolean;
}

const CustomerAvatar: React.FC<CustomerAvatarProps> = ({ customer, large = false }) => (
  <span className={large ? 'customer-avatar customer-avatar--large' : 'customer-avatar'}>
    {customer.avatarUrl ? (
      <img src={customer.avatarUrl} alt="" aria-hidden="true" />
    ) : (
      <span aria-hidden="true">{getCustomerInitials(customer)}</span>
    )}
    <span className="sr-only">{getCustomerDisplayName(customer)}</span>
  </span>
);

export default CustomerAvatar;
