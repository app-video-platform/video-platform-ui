/* eslint-disable max-len */
import React, { useId } from 'react';

import { VPSVGIconProps } from '@api/models';

import '../icons.styles.scss';

const CourseIcon: React.FC<VPSVGIconProps> = ({
  size = 24,
  className,
  title,
  variant = 'gradient',
  glow = false,
}) => {
  const uid = useId();
  const gradId = `course-grad-${uid}`;
  const glowId = `course-glow-${uid}`;

  const strokePaint = variant === 'mono' ? 'currentColor' : `url(#${gradId})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 292.91 299.25"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={['vp-svg-icon', className].filter(Boolean).join(' ')}
    >
      <defs>
        {/* unified gradient across the WHOLE icon */}
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="292.91"
          y2="299.25"
        >
          <stop offset="0%" stopColor="#3A2E6F" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3BC9DB" stopOpacity="0.95" />
        </linearGradient>

        {/* optional glow */}
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        fill="none"
        stroke={strokePaint}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
        filter={glow && variant !== 'mono' ? `url(#${glowId})` : undefined}
      >
        <path d="M235.74,97.42H69.39c-4.88,0-8.71-4.17-8.31-9.03l6.73-80.74c.36-4.32,3.97-7.64,8.31-7.64h153.42c4.36,0,7.98,3.36,8.31,7.7l6.19,80.74c.37,4.84-3.46,8.98-8.31,8.98Z" />
        <path d="M169.13,42.15l-31.56-13.53c-3.88-1.66-8.48,1.27-8.79,5.64l-2,28.19c-.34,4.85,4.12,8.18,8.49,6.28l33.79-14.68c5.16-2.24,5.14-9.72.07-11.89Z" />
        <path d="M152.01,179.91c-11.22-18.29,1.11-28.33,1.11-28.33L8.7,125.75l26.12-2.06-26.12,2.06s-18.61,14.44-1.39,26.94c29.72,5.55,144.7,27.22,144.7,27.22l141.65-28.33s-14.72-8.33-2.22-25.83l-18.96-1.72,18.96,1.72-138.31,25.83" />
        <path d="M173.4,145.74c-11.46-16.17,1.39-27.5,1.39-27.5L19.81,93.25s-16.12,18.68-1.39,27.77c16.06,2.68,154.98,24.72,154.98,24.72,0,0,100.03-21.63,111.93-24.72-11.94-8.89,0-23.61,0-23.61,0,0-92.53,17.43-110.54,20.83" />
        <line x1="285.14" y1="97.43" x2="252.94" y2="91.39" />
        <line x1="19.85" y1="93.25" x2="51.57" y2="88.99" />
      </g>
    </svg>
  );
};

export default CourseIcon;
