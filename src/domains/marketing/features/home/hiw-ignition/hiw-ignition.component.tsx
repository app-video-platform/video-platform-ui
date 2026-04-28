/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';

import './hiw-ignition.styles.scss';

interface HiwIgnitionProps {
  activeIndex: 0 | 1 | 2 | 3;
  className?: string;
}

const HowItWorksIgnition: React.FC<HiwIgnitionProps> = ({
  activeIndex,
  className,
}) => (
  <div
    className={clsx('hiw-rocket-icon', className, {
      'is-launching': activeIndex > 0,
    })}
  >
    <svg viewBox="0 0 40 72" aria-hidden="true">
      <defs>
        <linearGradient id="rocketGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A2E6F" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3BC9DB" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8F9FA" stopOpacity="0.75" />
          <stop offset="55%" stopColor="#3A2E6F" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3BC9DB" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="rocketWindow" cx="45%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#F8F9FA" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#3BC9DB" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3A2E6F" stopOpacity="0.18" />
        </radialGradient>
        <linearGradient id="rocketFlame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3BC9DB" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FFBD41" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <g transform="translate(0 2)">
        <path
          d="M33.26,43.12c-.33,2.91-1.48,12.17-3.22,16.3,3.32,2.93,7.02,6.17,7.02,6.17,0,0,5.3-17.21-2.91-22.88-.35-.24-.84-.02-.88.41Z"
          fill="url(#rocketGrad)"
          opacity="0.92"
        />
        <path
          d="M5.45,43.19c.27,2.49,1.44,12.32,3.25,16.61-3.32,2.93-7.02,6.17-7.02,6.17,0,0-5.42-17.58,3.18-23.06.24-.15.55,0,.58.28Z"
          fill="url(#rocketGrad)"
          opacity="0.92"
        />
        <path
          d="M27.62,12.5L20.38.42c-.33-.56-1.14-.56-1.47,0l-7.25,12.08c-4.99,8.32-6.62,18.24-4.54,27.72l4.64,21.2h15.76l4.64-21.2c2.08-9.48.45-19.4-4.54-27.72ZM19.64,31.4c-4.48,0-8.12-3.64-8.12-8.12s3.64-8.12,8.12-8.12,8.12,3.64,8.12,8.12-3.64,8.12-8.12,8.12Z"
          fill="url(#rocketBody)"
          opacity="0.96"
        />
        <circle
          cx="19.64"
          cy="23.28"
          r="5.93"
          fill="url(#rocketWindow)"
          opacity="0.9"
        />
        <path
          className="hiw-rocket-icon__flame"
          d="M13.94,64.11s6.4,15.9,11.41,0c-6.78,0-11.49,0-11.41,0Z"
          fill="url(#rocketFlame)"
          opacity="0.55"
        />
      </g>
    </svg>
  </div>
);

export default HowItWorksIgnition;
