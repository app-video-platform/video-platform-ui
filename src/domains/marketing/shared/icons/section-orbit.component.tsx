import React from 'react';

const SectionOrbit: React.FC = () => (
  <svg
    viewBox="0 0 1200 220"
    width="100%"
    height="70"
    preserveAspectRatio="none"
    style={{ display: 'block' }}
  >
    <defs>
      {/* Soft glow */}
      <filter id="orbitGlow" x="-30%" y="-100%" width="160%" height="300%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Main gradient (mostly purple) */}
      <linearGradient id="orbitGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#3A2E6F" stopOpacity="0" />
        <stop offset="20%" stopColor="#3A2E6F" stopOpacity="0.65" />
        <stop offset="50%" stopColor="#3BC9DB" stopOpacity="0.45" />
        <stop offset="80%" stopColor="#3A2E6F" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#3A2E6F" stopOpacity="0" />
      </linearGradient>

      {/* Highlight (thin top shine) */}
      <linearGradient id="orbitHighlight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="50%" stopColor="#3BC9DB" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Main curve */}
    <path
      d="M 0 100 C 260 210 940 210 1200 100"
      fill="none"
      stroke="url(#orbitGrad)"
      strokeWidth="2.5"
      filter="url(#orbitGlow)"
      strokeLinecap="round"
    />

    {/* Highlight slightly above main curve */}
    <path
      d="M 0 96 C 260 206 940 206 1200 96"
      fill="none"
      stroke="url(#orbitHighlight)"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.9"
    />
  </svg>
);

export default SectionOrbit;
