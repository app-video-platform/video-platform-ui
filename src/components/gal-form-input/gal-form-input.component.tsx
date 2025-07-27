import React from 'react';

import './gal-form-input.styles.scss';
import GalAutoResizeTextarea from './gal-auto-resize-textarea/gal-auto-resize-textarea.component';

interface GalFormInputProps {
  label?: string;
  value: string | number;
  required?: boolean;
  inputType?: 'text' | 'textarea';
  isMaxLengthShown?: boolean;
  maxLength?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const GalFormInput: React.FC<GalFormInputProps> = ({
  label,
  required,
  value,
  inputType = 'text',
  isMaxLengthShown = false,
  maxLength = 999,
  ...otherProps
}) => (
  <div className="group">
    {inputType === 'textarea' ? (
      <GalAutoResizeTextarea
        id={otherProps.name}
        value={value as string}
        className="form-input"
        data-testid={`textarea-${otherProps.name}`}
        maxLength={maxLength}
        {...otherProps}
        required={required}
      />
    ) : (
      <input
        className="form-input"
        {...otherProps}
        required={required}
        id={otherProps.name}
        data-testid={`input-${otherProps.name}`}
        value={value}
        maxLength={maxLength}
      />
    )}

    {isMaxLengthShown && (
      <span className="input-max-value">
        {String(value ?? '').length} / {maxLength}
      </span>
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
