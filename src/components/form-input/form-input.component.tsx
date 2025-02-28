import React from 'react';

import './form-input.styles.scss';

interface FormInputProps {
  label?: string;
  value: string;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const FormInput: React.FC<FormInputProps> = ({ label, required, value, ...otherProps }) => (
  <div className="group">
    <input className="form-input" {...otherProps} required={required} />
    {label && (
      <label className={`${value ? 'shrink' : ''} form-input-label`} >
        {label} {required && <span className="text-red">*</span>}
      </label>
    )}
  </div>
);

export default FormInput;