import React from 'react';
import clsx from 'clsx';

import './radio.styles.scss';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  value: string;
  description?: string;
}

const Radio: React.FC<RadioProps> = ({
  label,
  description,
  checked,
  disabled,
  className,
  ...rest
}) => (
  <label
    className={clsx(
      'radio',
      {
        checked,
        disabled,
      },
      className,
    )}
  >
    <input type="radio" checked={checked} disabled={disabled} {...rest} />
    <span className="radio__control" />

    <span className="radio__content">
      <span className="radio__label">{label}</span>
      {description && <span className="radio__description">{description}</span>}
    </span>
  </label>
);

export default Radio;
