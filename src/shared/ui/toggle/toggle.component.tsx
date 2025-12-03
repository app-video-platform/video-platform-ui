import React from 'react';
import clsx from 'clsx';

import './toggle.styles.scss';

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  disabled,
  className,
  ...rest
}) => (
  <label
    className={clsx(
      'toggle',
      {
        checked,
        disabled,
      },
      className,
    )}
  >
    <input
      type="checkbox"
      checked={checked}
      className="toggle-input"
      {...rest}
    />
    {/* <span className="toggle__track">
      <span className="toggle__thumb" />
    </span> */}
    {label && <span className="toggle-label">{label}</span>}
  </label>
);

export default Toggle;
