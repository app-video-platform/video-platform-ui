import React from 'react';
import './gal-select.styles.scss';

export interface GalSelectOption {
  value: string | number;
  label: string;
}

interface GalSelectProps {
  label?: string;
  name: string;
  value: string | number;
  options: GalSelectOption[];
  required?: boolean;
  // eslint-disable-next-line , no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  // Allow additional props (e.g., className, id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const GalSelect: React.FC<GalSelectProps> = ({
  label,
  name,
  value,
  options,
  required = false,
  onChange,
  ...otherProps
}) => (
  <div className="group">
    <select
      className="form-input"
      name={name}
      id={name}
      value={value}
      required={required}
      onChange={onChange}
      {...otherProps}
    >
      <option value="" disabled hidden>
        {label ? `Select ${label}` : 'Select...'}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>

    {label && (
      <label
        className={`${
          value !== undefined && value !== '' ? 'shrink' : ''
        } form-input-label`}
        htmlFor={name}
      >
        {label} {required && <span className="text-red">*</span>}
      </label>
    )}
  </div>
);

export default GalSelect;
