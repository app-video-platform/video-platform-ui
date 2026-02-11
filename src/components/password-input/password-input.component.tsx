import { Input } from '@shared/ui';
import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

import './password-input.styles.scss';

interface GalPasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  value: string;
  label?: string;
  required?: boolean;
  showRules?: boolean; // whether to show the rules list
}

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

const PasswordInput: React.FC<GalPasswordInputProps> = ({
  value,
  label,
  required,
  showRules = true,
  maxLength,
  onFocus,
  onBlur,
  ...otherProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Input
        {...otherProps}
        label={label}
        required={required}
        value={value}
        prefix="none"
        maxLength={maxLength}
        type={showPassword ? 'text' : 'password'}
        suffixIcon={showPassword ? FaEye : FaEyeSlash}
        handleSuffixClick={handlePasswordVisibility}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {showRules && isFocused && (
        <ul className="password-rules">
          {passwordValidationRules.map((rule) => (
            <li
              key={rule.id}
              className={`password-rule ${
                rule.test(String(value)) ? 'green' : 'grey'
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

export default PasswordInput;
