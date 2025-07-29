import React, { useState } from 'react';

import './gal-form-input.styles.scss';
import GalAutoResizeTextarea from './gal-auto-resize-textarea/gal-auto-resize-textarea.component';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldVisibility {
  isFieldPassword?: boolean;
  isMainField?: boolean;
}

interface GalFormInputProps {
  label?: string;
  value: string | number;
  required?: boolean;
  inputType?: 'text' | 'textarea';
  isMaxLengthShown?: boolean;
  passwordField?: PasswordFieldVisibility;
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
  passwordField = { isFieldPassword: false, isMainField: false },
  maxLength = 999,
  ...otherProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const passwordValidationRules = [
    {
      id: 'length',
      label: 'At least 8 characters',
      test: (pw: string) => pw.length >= 8,
    },
    {
      id: 'lowercase',
      label: 'At least one lowercase letter',
      test: (pw: string) => /[a-z]/.test(pw),
    },
    {
      id: 'uppercase',
      label: 'At least one uppercase letter',
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      id: 'number',
      label: 'At least one number',
      test: (pw: string) => /\d/.test(pw),
    },
    {
      id: 'special',
      label: 'At least one special character (!@#$%^&*)',
      test: (pw: string) => /[!@#$%^&*]/.test(pw),
    },
  ];

  return (
    <>
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
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
        )}

        {isMaxLengthShown && (
          <span className="input-max-value">
            {String(value ?? '').length} / {maxLength}
          </span>
        )}

        {passwordField.isFieldPassword && (
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            data-testid="toggle-password-password"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
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
      {passwordField.isMainField && isPasswordFocused && (
        <ul className="password-rules">
          {passwordValidationRules.map((rule) => (
            <li
              key={rule.id}
              className={`password-rule ${isPasswordFocused ? 'red' : 'grey'} ${
                rule.test(String(value)) ? 'green' : ''
              }`}
            >
              {rule.label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default GalFormInput;
