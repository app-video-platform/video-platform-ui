import React from 'react';
import clsx from 'clsx';

import './button.styles.scss';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'outline'
  | 'danger'
  | 'remove'
  | 'neutral';
export type ButtonShape = 'round' | 'square';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  shape?: ButtonShape;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  shape = 'square',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => (
  <button
    className={clsx(
      'vp-btn',
      `vp-btn__${variant}`,
      `vp-btn__${shape}`,
      className,
      {
        loading: loading,
      },
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <span>Loading</span> : children}
  </button>
);

export default Button;
