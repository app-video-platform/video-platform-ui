import React, { ReactNode } from 'react';
import clsx from 'clsx';

import './button.styles.scss';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'destructive'
  | 'outline'
  | 'danger'
  | 'remove'
  | 'neutral';
export type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'icon'
  | 'small'
  | 'medium'
  | 'large';
export type ButtonShape = 'round' | 'square';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  shape?: ButtonShape;
  label?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
}

const normalizeSize = (size: ButtonSize): 'sm' | 'md' | 'lg' | 'icon' => {
  if (size === 'small') {
    return 'sm';
  }
  if (size === 'medium') {
    return 'md';
  }
  if (size === 'large') {
    return 'lg';
  }
  return size;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  shape = 'square',
  loading = false,
  label,
  leadingIcon,
  trailingIcon,
  className,
  children,
  disabled,
  'aria-label': ariaLabel,
  ...props
}) => {
  const normalizedSize = normalizeSize(size);
  const content = label ?? children;
  const buttonAriaLabel =
    ariaLabel ?? (loading && typeof content === 'string' ? content : undefined);

  return (
    <button
      className={clsx(
        'vp-btn',
        `vp-btn__${variant}`,
        `vp-btn__${shape}`,
        `vp-btn__size-${normalizedSize}`,
        className,
        {
          loading: loading,
        },
      )}
      aria-label={buttonAriaLabel}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      <span className="vp-btn__content">
        {leadingIcon && <span className="vp-btn__icon">{leadingIcon}</span>}
        {content}
        {trailingIcon && <span className="vp-btn__icon">{trailingIcon}</span>}
      </span>
      {loading && (
        <span className="vp-btn__loader" role="status" aria-label="Loading">
          <span className="vp-btn__spinner" aria-hidden="true" />
        </span>
      )}
    </button>
  );
};

export default Button;
