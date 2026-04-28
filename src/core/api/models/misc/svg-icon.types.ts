export type VPSVGIconProps = {
  size?: number;
  className?: string;
  title?: string;
  /** mono = currentColor; gradient = brand gradient fill */
  variant?: 'mono' | 'gradient';
  /** adds subtle outer glow (via CSS filter) */
  glow?: boolean;
};
