import React from 'react';
import clsx from 'clsx';
import { IconType } from 'react-icons';

import { VPIcon } from '../vp-icon';
import { getCssVar } from '@shared/utils';

import './input.styles.scss';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string | number;
  required?: boolean;
  maxLength?: number;
  className?: string;
  error?: string;
  prefixIcon?: IconType;
  suffixIcon?: IconType;
  handleSuffixClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
  label,
  required,
  value,
  maxLength = 999,
  type = 'text',
  className,
  error,
  readOnly,
  disabled,
  prefixIcon,
  suffixIcon,
  handleSuffixClick,
  ...otherProps
}) => {
  const inputClass = clsx('input-field', {
    'input-error': error,
    'input-with-prefix': prefixIcon,
    readOnly,
    disabled,
  });

  return (
    <div className={clsx('input-wrapper', className)}>
      {label && (
        <label htmlFor={otherProps.name} className="input-label">
          {label}
        </label>
      )}
      <div className="input-row">
        {prefixIcon && (
          <VPIcon
            className="input-prefix"
            icon={prefixIcon}
            color={getCssVar('--text-secondary')}
            size={19}
          />
        )}
        <input
          className={inputClass}
          {...otherProps}
          required={required}
          id={otherProps.name}
          data-testid={`input-${otherProps.name}`}
          value={value}
          maxLength={maxLength}
          type={type}
        />
        {suffixIcon && (
          <button
            type="button"
            onClick={handleSuffixClick}
            className="input-suffix"
          >
            <VPIcon
              icon={suffixIcon}
              color={getCssVar('--text-secondary')}
              size={18}
            />
          </button>
        )}
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
