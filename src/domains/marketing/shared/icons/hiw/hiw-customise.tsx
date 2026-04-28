/* eslint-disable max-len */
import React, { useId } from 'react';

import { VPSVGIconProps } from '@api/models';

import './../icons.styles.scss';

const HiwCustomiseIcon: React.FC<VPSVGIconProps> = ({
  size = 32,
  className,
  title,
  variant = 'gradient',
  glow = false,
}) => {
  const uid = useId();

  const upBodyId = `hiw-customise-upbody-${uid}`;
  const lowBodyId = `hiw-customise-lowbody-${uid}`;
  const wingId = `hiw-customise-wing-${uid}`;
  const brushId = `hiw-customise-brush-${uid}`;

  const wingFill = variant === 'mono' ? 'currentColor' : `url(#${wingId})`;
  const upBodyFill = variant === 'mono' ? 'currentColor' : `url(#${upBodyId})`;
  const lowBodyFill =
    variant === 'mono' ? 'currentColor' : `url(#${lowBodyId})`;
  const brushFill = variant === 'mono' ? 'currentColor' : `url(#${brushId})`;

  return (
    <svg
      width={size}
      height={(size * 235.44) / 300}
      viewBox="0 0 300 235.44"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={['vp-svg-icon', glow ? 'vp-svg-icon--glow' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      <defs>
        <linearGradient id={wingId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A2E6F" />
          <stop offset="100%" stopColor="#3BC9DB" />
        </linearGradient>
        <linearGradient id={upBodyId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A2E6F" />
          <stop offset="100%" stopColor="#604eb1" />
        </linearGradient>
        <linearGradient id={lowBodyId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3699a6" />
          <stop offset="100%" stopColor="#3BC9DB" />
        </linearGradient>
        <linearGradient id={brushId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffbd41" />
          <stop offset="100%" stopColor="#e6a832" />
        </linearGradient>
      </defs>

      {/* Main grey shapes */}
      <path
        d="M128.2,212.3c-11.71-1.03-49.01-4.73-65.76-11.32-11.44,13.6-24.08,28.77-24.08,28.77,0,0,69.62,19.59,91.56-13.94.94-1.44-.01-3.36-1.72-3.51Z"
        fill={wingFill}
      />
      <path
        d="M125.21,100.64c-9.99,1.35-49.32,7-66.36,14.69-12.09-13.02-25.45-27.56-25.45-27.56,0,0,70.07-23.47,92.89,10.53.62.93.04,2.2-1.07,2.35Z"
        fill={wingFill}
      />
      <path
        d="M153.64,196.68c-6.66-1.87-4.41-13.64,6.17-16.04,10.57-2.41,1.27-13.15-15.32-14.78-16.59-1.63-5.26-17.69-.36-14.75,4.9,2.93,10.82-5.35,10.82-5.35,0,0-3.75-7.54,5.4-7.77s-6.37-11.04-20.24-19.36c-8.03-4.81,7.04-11.04,21.15-15.44-8.02.65-16.03,1.93-23.94,3.87l-84.67,20.73.77,31.64.77,31.64,85.58,16.57c1.56.3,3.12.57,4.68.82-5.89-4.32,14.71-10.22,9.19-11.77Z"
        fill={lowBodyFill}
      />

      {/* Dark core body */}
      <path
        d="M184.02,209.65c23.49-2.35,46.32-10.12,66.59-22.97l47.78-30.28c2.2-1.39,2.12-4.63-.14-5.92l-49.21-27.91c-20.88-11.84-44.06-18.49-67.63-19.69-6.7-.34-13.44-.24-20.16.31-14.11,4.39-29.18,10.62-21.15,15.44,13.87,8.31,29.38,19.13,20.24,19.36s-5.4,7.77-5.4,7.77c0,0-5.91,8.29-10.82,5.35-4.9-2.93-16.23,13.12.36,14.75,16.59,1.63,25.89,12.38,15.32,14.78-10.57,2.41-12.83,14.17-6.17,16.04,5.52,1.55-15.08,7.45-9.19,11.77,13.18,2.13,26.47,2.51,39.57,1.2Z"
        fill={upBodyFill}
      />

      {/* Accent yellow elements */}
      <path
        d="M130.96,93.6c-7.97-8.15-15.81-16.09-20.93-21.05l-42.34,40.4c3.77,4.04,11.98,12.88,20.13,21.82l43.15-41.17Z"
        fill={brushFill}
      />
      <path
        d="M65.67,110.2l41.91-39.99s-.02-.02-.03-.03c-28.85,4.62-47.47-18.14-50.56-22.36-3.1-4.22-19.22-22.37-22.14-25.2C31.92,19.79,1.9-8.48.11,2.54c-1.79,11.02,18.25,31.88,45.95,57.18,25.52,23.32,20.55,46.92,19.62,50.48Z"
        fill={brushFill}
      />
      <path
        d="M90.08,137.26c7.04,7.75,13.72,15.25,17.06,19.4,6.44,8,5.94,11.11,5.16,12.22,2.39-2.1,10.95-9.63,15.1-13.63,4.85-4.67-8.37-19.4-8.37-19.4l13.22,14.33,27.67-26.66s-13.11-13.67-26.61-27.51l-43.23,41.25Z"
        fill={upBodyFill}
      />
    </svg>
  );
};

export default HiwCustomiseIcon;
