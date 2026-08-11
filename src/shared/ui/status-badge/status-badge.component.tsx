import React from 'react';
import clsx from 'clsx';
import { IconType } from 'react-icons';

import { GalIcon } from '../gal-icon';

import './status-badge.styles.scss';

export type StatusBadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';
export type StatusBadgeSize = 'sm' | 'md';

interface StatusBadgeProps {
  label: string;
  tone?: StatusBadgeTone;
  icon?: IconType;
  size?: StatusBadgeSize;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  tone = 'neutral',
  icon,
  size = 'md',
  className,
}) => (
  <span
    className={clsx(
      'status-badge',
      `status-badge--${tone}`,
      `status-badge--${size}`,
      className,
    )}
  >
    {icon && <GalIcon icon={icon} size={size === 'sm' ? 13 : 15} aria-hidden="true" />}
    <span>{label}</span>
  </span>
);

export default StatusBadge;
