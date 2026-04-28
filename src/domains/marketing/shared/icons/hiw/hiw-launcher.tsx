/* eslint-disable max-len */
import React, { useId } from 'react';

import { VPSVGIconProps } from '@api/models';

import '../icons.styles.scss';

const HiwLauncherIcon: React.FC<VPSVGIconProps> = ({
  size = 32,
  className,
  title,
  variant = 'gradient',
  glow = false,
}) => {
  const uid = useId();
  const bodyId = `hiw-launch-body-${uid}`;
  const leftWingId = `hiw-launch-lWing-${uid}`;
  const rightWingId = `hiw-launch-rWing-${uid}`;
  const thrustId = `hiw-launch-thrust-${uid}`;

  const bodyFill = variant === 'mono' ? 'currentColor' : `url(#${bodyId})`;
  const leftWingFill =
    variant === 'mono' ? 'currentColor' : `url(#${leftWingId})`;
  const rightWingFill =
    variant === 'mono' ? 'currentColor' : `url(#${rightWingId})`;
  const thrustFill = variant === 'mono' ? 'currentColor' : `url(#${thrustId})`;

  return (
    <svg
      width={size}
      height={(size * 297.23) / 300}
      viewBox="0 0 300 297.23"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={['vp-svg-icon', glow ? 'vp-svg-icon--glow' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      <defs>
        <linearGradient id={bodyId} x1="0.8" y1="1" x2="1" y2="0.7">
          <stop offset="0%" stopColor="#3BC9DB" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#5741b8" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={leftWingId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#316a71" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3BC9DB" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={rightWingId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3BC9DB" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#316a71" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={thrustId} x1="1" y1="0.8" x2="0" y2="0.8">
          <stop offset="0%" stopColor="#fffd9f" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f52626" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <path
        d="M193.92,203.56c-11.52,9.21-48.56,38.17-69.47,46.71,1.41,22.25,3.09,46.96,3.09,46.96,0,0,80.13-42.54,70.98-91.98-.39-2.12-2.92-3.04-4.61-1.69Z"
        fill={leftWingFill}
      />
      <path
        d="M94.45,104.86c-7.89,9.88-38.67,49.09-47.47,70.83-22.25-1.34-46.97-2.95-46.97-2.95,0,0,43.23-82.01,93.38-70.93,1.37.3,1.94,1.96,1.07,3.06Z"
        fill={rightWingFill}
        opacity="0.92"
      />
      <path
        d="M282.76,74.25l17.11-68.87c.79-3.17-2.09-6.04-5.26-5.24l-68.82,17.31c-47.42,11.93-88.49,41.53-114.8,82.75l-58.84,92.16,28.11,28.03,28.11,28.03,91.99-59.12c41.14-26.44,70.61-67.59,82.4-115.05ZM187.02,113.31c-16-15.95-16.04-41.86-.09-57.86,15.95-16,41.86-16.04,57.86-.09,16,15.95,16.04,41.86.09,57.86-15.95,16-41.86,16.04-57.86.09Z"
        fill={bodyFill}
      />
      <path
        d="M50.31,209.72s-79.56,125.46,40.71,40.59c-24.21-24.13-40.99-40.86-40.71-40.59Z"
        fill={thrustFill}
        opacity="0.85"
      />
    </svg>
  );
};

export default HiwLauncherIcon;
