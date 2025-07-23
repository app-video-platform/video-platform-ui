import React from 'react';

import './gal-form-input.styles.scss';

interface GalFormInputProps {
  label?: string;
  value: string | number;
  required?: boolean;
  inputType?: 'text' | 'textarea';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const GalFormInput: React.FC<GalFormInputProps> = ({
  label,
  required,
  value,
  inputType = 'text',
  ...otherProps
}) => (
  <div className="group">
    {inputType === 'textarea' ? (
      <textarea
        className="form-input"
        {...otherProps}
        required={required}
        id={otherProps.name}
        data-testid={`textarea-${otherProps.name}`}
        value={value}
      />
    ) : (
      <input
        className="form-input"
        {...otherProps}
        required={required}
        id={otherProps.name}
        data-testid={`input-${otherProps.name}`}
        value={value}
      />
    )}

    {label && (
      <label
        className={`${value ? 'shrink' : ''} form-input-label`}
        htmlFor={otherProps.name}
      >
        {label} {required && <span className="text-red">*</span>}
      </label>
    )}
  </div>
);

export default GalFormInput;
