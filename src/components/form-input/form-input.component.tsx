import React from 'react';

import './form-input.styles.scss';

interface FormInputXProps {
  label?: string;
  value: string | number;
  required?: boolean;
  inputType?: 'text' | 'textarea';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const FormInputX: React.FC<FormInputXProps> = ({
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

export default FormInputX;
