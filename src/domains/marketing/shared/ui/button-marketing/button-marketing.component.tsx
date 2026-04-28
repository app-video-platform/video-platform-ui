import React from 'react';
import clsx from 'clsx';

import './button-marketing.styles.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'neutral';

export interface ButtonMarketingProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  className?: string;
}

const ButtonMarketing: React.FC<ButtonMarketingProps> = ({
  variant = 'primary',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => (
  <button
    className={clsx('vp-btn-mkt', `vp-btn-mkt__${variant}`, className, {
      loading: loading,
    })}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <span>Loading</span> : children}
  </button>
);

export default ButtonMarketing;
