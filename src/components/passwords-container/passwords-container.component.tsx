import React, { useState } from 'react';

import './passwords-container.styles.scss';
import FormInputX from '../form-input/form-input.component';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordsContainerProps {
  passwordInput: string;
  confirmPasswordInput: string;
  passwordErrors: string;
  confirmPasswordErrors: string;
  // eslint-disable-next-line no-unused-vars
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // setErrors: () => void
}

const PasswordsContainer: React.FC<PasswordsContainerProps> = ({
  passwordInput,
  passwordErrors,
  confirmPasswordInput,
  confirmPasswordErrors,
  handleChange,
}) => {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

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

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field], // Toggle the specific field
    }));
  };

  return (
    <>
      <div className="password-group">
        <FormInputX
          label="Password"
          type={showPassword.password ? 'text' : 'password'} // Toggle input type
          name="password"
          value={passwordInput}
          onChange={handleChange}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          required
        />
        <button
          type="button"
          className="toggle-password-btn"
          onClick={() => togglePasswordVisibility('password')}
          data-testid="toggle-password-password"
        >
          {showPassword.password ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      {passwordErrors && <p className="error-text-red">{passwordErrors}</p>}
      {isPasswordFocused && (
        <ul className="password-rules">
          {passwordValidationRules.map((rule) => (
            <li
              key={rule.id}
              className={`password-rule ${isPasswordFocused ? 'red' : 'grey'} ${
                rule.test(passwordInput) ? 'green' : ''
              }`}
            >
              {rule.label}
            </li>
          ))}
        </ul>
      )}
      <div className="password-group">
        <FormInputX
          label="Confirm Password"
          type={showPassword.confirmPassword ? 'text' : 'password'} // Toggle input type
          name="confirmPassword"
          value={confirmPasswordInput}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          className="toggle-password-btn"
          onClick={() => togglePasswordVisibility('confirmPassword')}
        >
          {showPassword.confirmPassword ? (
            <Eye size={20} />
          ) : (
            <EyeOff size={20} />
          )}
        </button>
      </div>
      {confirmPasswordErrors && (
        <p className="error-text-red">{confirmPasswordErrors}</p>
      )}
    </>
  );
};

export default PasswordsContainer;
