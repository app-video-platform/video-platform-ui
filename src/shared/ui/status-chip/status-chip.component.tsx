import React from 'react';

import { ProductStatus } from '@api/types';

import './status-chip.styles.scss';

interface TabsProps {
  status: ProductStatus;
}

const StatusChip: React.FC<TabsProps> = ({ status }) => (
  <div className={`status-chip status-chip__${status}`}>
    <span>{status}</span>
  </div>
);

export default StatusChip;
