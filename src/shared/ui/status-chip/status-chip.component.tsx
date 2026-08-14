import React from 'react';

import { ProductStatus } from 'core/api/models';
import { StatusBadge, StatusBadgeTone } from '../status-badge';

import './status-chip.styles.scss';

interface TabsProps {
  status: ProductStatus;
}

const productStatusTone: Record<string, StatusBadgeTone> = {
  PUBLISHED: 'success',
  DRAFT: 'neutral',
  HIDDEN: 'warning',
};

const StatusChip: React.FC<TabsProps> = ({ status }) => (
  <StatusBadge
    className={`status-chip status-chip__${status}`}
    label={status}
    tone={productStatusTone[status] ?? 'neutral'}
  />
);

export default StatusChip;
