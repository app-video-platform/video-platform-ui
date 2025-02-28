import React from 'react';

import './form-input.styles.scss';

interface FormInputProps {
    label?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const FormInput: React.FC<FormInputProps> = ({ label, ...otherProps }) => (
  <div className="group">
    <input className="form-input" {...otherProps} />
    {label && (
      <label
        className={`${otherProps.value.length ? 'shrink' : ''} form-input-label`}>
        {label}
      </label>
    )}
  </div>
);

export default FormInput;