import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@shared/ui';
import { PasswordsContainer } from '@shared/components';

import './change-password.styles.scss';

export interface ChangePasswordFormData {
  password: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePasswordChange = () => {
    navigate('/signin');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <PasswordsContainer
        passwordInput={formData.password}
        passwordErrors={errors.password}
        confirmPasswordInput={formData.confirmPassword}
        confirmPasswordErrors={errors.confirmPassword}
        handleChange={handleChange}
      />
      <Button
        type="button"
        variant="primary"
        onClick={() => handlePasswordChange()}
      >
        Change password
      </Button>
    </>
  );
};

export default ChangePassword;
