import React from 'react';

import { PasswordInput } from '@shared/components/password-input';

import './passwords-container.styles.scss';

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
}) => (
  <>
    <PasswordInput
      label="Password"
      name="password"
      value={passwordInput}
      onChange={handleChange}
      showRules={true}
      required
    />

    {passwordErrors && <p className="error-text-red">{passwordErrors}</p>}

    <PasswordInput
      label="Confirm Password"
      name="confirmPassword"
      value={confirmPasswordInput}
      onChange={handleChange}
      required
    />

    {confirmPasswordErrors && (
      <p className="error-text-red">{confirmPasswordErrors}</p>
    )}
  </>
);

export default PasswordsContainer;
