/* eslint-disable max-len */
import React, { useId } from 'react';

export interface AboutHeroPlanetProps {
  className?: string;
  title?: string;
  /** Useful if you want to size it with CSS but still offer a quick prop */
  width?: number | string;
  height?: number | string;
}

/**
 * About-hero-only planet illustration (vector-only).
 * - No embedded raster images
 * - Crescent uses gradient falloff (no chalky flat white)
 * - IDs are prefixed with useId() to avoid collisions
 * - Orbit rings have class hooks for GSAP (stroke-draw animations)
 */
const AboutHeroPlanet: React.FC<AboutHeroPlanetProps> = ({
  className,
  title,
  width = '100%',
  height = '100%',
}) => {
  const uid = useId();

  // Prefix all ids to avoid collisions if the SVG is ever rendered more than once.
  const ids = {
    radialMain: `radial-main-${uid}`,
    highlightGrad: `highlight-grad-${uid}`,
    ringGradA: `ring-grad-a-${uid}`,
    ringGradB: `ring-grad-b-${uid}`,
    crescentGrad: `crescent-grad-${uid}`,
    blurAtmos: `blur-atmos-${uid}`,
    blurHighlight: `blur-highlights-${uid}`,
  };

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 1410.46 947.06"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      <defs>
        {/* Main planet fill (kept close to your original stops; feel free to simplify later) */}
        <radialGradient
          id={ids.radialMain}
          cx="1053.64"
          cy="733.97"
          fx="1053.64"
          fy="733.97"
          r="881.74"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0c0b22" />
          <stop offset="0.4" stopColor="#0d0c23" />
          <stop offset="0.54" stopColor="#12102a" />
          <stop offset="0.64" stopColor="#1b1736" />
          <stop offset="0.72" stopColor="#272247" />
          <stop offset="0.79" stopColor="#382f5d" />
          <stop offset="0.85" stopColor="#4c4078" />
          <stop offset="0.91" stopColor="#645499" />
          <stop offset="0.96" stopColor="#7f6bbd" />
          <stop offset="1" stopColor="#9980df" />
        </radialGradient>

        {/* Your small top highlight ellipse gradient */}
        <linearGradient
          id={ids.highlightGrad}
          x1="329.15"
          y1="225.61"
          x2="394.73"
          y2="262.87"
          gradientTransform="translate(375.34 -193.34) rotate(57.51)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#b9a0ef" />
          <stop offset="1" stopColor="#443a6d" stopOpacity="0.48" />
        </linearGradient>

        {/* Orbit ring gradients (kept from your original) */}
        <radialGradient
          id={ids.ringGradA}
          cx="683.73"
          cy="429.26"
          fx="683.73"
          fy="429.26"
          r="531.5"
          gradientTransform="translate(163.87 -188.39) rotate(17.79)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#b9a0ef" />
          <stop offset="0.11" stopColor="#bea2e8" />
          <stop offset="0.25" stopColor="#cfabd7" />
          <stop offset="0.41" stopColor="#e9b8bb" />
          <stop offset="0.5" stopColor="#fbc1a9" />
          <stop offset="0.58" stopColor="#e4a5aa" />
          <stop offset="0.67" stopColor="#d08dac" />
          <stop offset="0.77" stopColor="#c17bad" />
          <stop offset="0.88" stopColor="#b871ad" />
          <stop offset="1" stopColor="#b66eae" />
        </radialGradient>

        <radialGradient
          id={ids.ringGradB}
          cx="715.97"
          cy="418.92"
          fx="715.97"
          fy="418.92"
          r="531.5"
          gradientTransform="translate(162.25 -198.74) rotate(17.79)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#b9a0ef" />
          <stop offset="0.11" stopColor="#bea2e8" />
          <stop offset="0.25" stopColor="#cfabd7" />
          <stop offset="0.41" stopColor="#e9b8bb" />
          <stop offset="0.5" stopColor="#fbc1a9" />
          <stop offset="0.55" stopColor="#edbab7" />
          <stop offset="0.65" stopColor="#d6aecf" />
          <stop offset="0.75" stopColor="#c6a6e1" />
          <stop offset="0.87" stopColor="#bca1eb" />
          <stop offset="1" stopColor="#b9a0ef" />
        </radialGradient>

        {/* ✅ Suggested improvement:
            Replace flat white crescent with a light falloff gradient (premium, not chalky). */}
        <linearGradient
          id={ids.crescentGrad}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#F8F9FA" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#F8F9FA" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F8F9FA" stopOpacity="0" />
        </linearGradient>

        <filter id={ids.blurAtmos} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter
          id={ids.blurHighlight}
          x="-70%"
          y="-70%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* Soft outer atmosphere / shadow plate */}
      <path
        className="planet-atmos"
        d="M791.01,10.05c-31.46-6.58-64.06-10.05-97.47-10.05C432.01,0,220.01,212.01,220.01,473.53c0,238.6,176.47,435.98,406.01,468.75,22.05,3.15,44.6,4.78,67.52,4.78,261.52,0,473.53-212.01,473.53-473.53,0-228.11-161.3-418.54-376.06-463.48Z"
        fill="#362f66"
        opacity="0.25"
        filter={`url(#${ids.blurAtmos})`}
      />

      {/* Soft glow shape (kept, but no blend modes) */}
      <path
        className="planet-glow"
        d="M577.63,53.45s-397.29,34.17-315.84,382.81C343.24,784.9,577.63,53.45,577.63,53.45Z"
        fill="#cc9ef5"
        opacity="0.2"
        filter={`url(#${ids.blurHighlight})`}
      />

      {/* Main sphere */}
      <path
        className="planet-sphere"
        d="M787.85,25.05c-30.44-6.37-61.99-9.73-94.32-9.73-253.06,0-458.21,205.15-458.21,458.21,0,230.88,170.76,421.87,392.87,453.58,21.34,3.05,43.15,4.63,65.33,4.63,253.06,0,458.21-205.15,458.21-458.21,0-220.73-156.08-405-363.89-448.48Z"
        fill={`url(#${ids.radialMain})`}
      />

      {/* Crescent “inside glow” - now gradient falloff */}
      <path
        className="planet-crescent"
        d="M245.33,479.53c0-253.06,205.15-458.21,458.21-458.21,32.33,0,63.88,3.36,94.32,9.73,48.59,10.17,94.34,28.03,135.94,52.25-44.22-27.28-93.43-47.27-145.94-58.25-30.44-6.37-61.99-9.73-94.32-9.73-253.06,0-458.21,205.15-458.21,458.21,0,169.09,91.59,316.78,227.87,396.18-130.74-80.7-217.87-225.26-217.87-390.18Z"
        fill={`url(#${ids.crescentGrad})`}
      />

      {/* Top highlight ellipse */}
      <ellipse
        cx="363.82"
        cy="245.31"
        rx="111.83"
        ry="42.74"
        transform="translate(-38.51 420.45) rotate(-57.51)"
        fill={`url(#${ids.highlightGrad})`}
        opacity="0.48"
        className="planet-highlight"
      />

      {/* Orbit rings (add classes for GSAP stroke-draw animations) */}
      {/* <ellipse
        className="planet-ring planet-ring--a"
        cx="683.73"
        cy="429.26"
        rx="712.54"
        ry="232.85"
        transform="translate(-98.46 229.46) rotate(-17.79)"
        fill="none"
        stroke={`url(#${ids.ringGradA})`}
        strokeMiterlimit="10"
        strokeWidth="3"
      />

      <ellipse
        className="planet-ring planet-ring--b"
        cx="715.97"
        cy="418.92"
        rx="712.54"
        ry="232.85"
        transform="translate(-81.14 189.31) rotate(-14.26)"
        fill="none"
        stroke={`url(#${ids.ringGradB})`}
        strokeMiterlimit="10"
        strokeWidth="2" // slightly lighter supporting ring (recommended)
        opacity="0.85"
      /> */}

      <path
        className="planet-ring planet-ring--a"
        d="M1014.4,122.76c187.92-16.08,323.68,13.62,347.8,88.78,39.29,122.45-232.61,319.19-607.31,439.44-374.7,120.25-710.31,118.46-749.61-3.98-23.67-73.77,65.61-174.52,222.29-269.25"
        fill="none"
        stroke={`url(#${ids.ringGradA})`}
        strokeMiterlimit="10"
        strokeWidth="3"
      />
      <path
        className="planet-ring planet-ring--b"
        d="M1030.71,134.6c206.43-10.11,355.23,27.72,375.84,108.77,31.68,124.63-251.81,304.27-633.21,401.22-381.39,96.96-716.26,74.52-747.94-50.11-17.78-69.92,63.65-157.16,205.92-237.39"
        fill="none"
        stroke={`url(#${ids.ringGradB})`}
        strokeMiterlimit="10"
        strokeWidth="2"
        opacity="0.85"
      />
      <ellipse
        className="planet-ring planet-ring--sheen"
        cx="683.73"
        cy="429.26"
        rx="712.54"
        ry="232.85"
        transform="translate(-98.46 229.46) rotate(-17.79)"
        fill="none"
        stroke="rgba(248, 249, 250, 0.0)"
        strokeWidth="1.2"
      />
    </svg>
  );
};

export default AboutHeroPlanet;
