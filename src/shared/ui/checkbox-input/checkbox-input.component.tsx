import React from 'react';
import clsx from 'clsx';

import './checkbox-input.styles.scss';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

const CheckboxInput: React.FC<CheckboxProps> = ({
  label,
  className,
  checked,
  disabled,
  ...inputProps
}) => {
  const inputClass = clsx('checkbox-input', className, { checked, disabled });

  return (
    <label className={inputClass}>
      <input type="checkbox" {...inputProps} />
      <span className="checkbox-box" />
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

export default CheckboxInput;
