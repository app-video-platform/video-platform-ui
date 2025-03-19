import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PasswordsContainer from '../../../components/passwords-container/passwords-container.component';
import Button from '../../../components/button/button.component';

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
    console.log('password change form data', formData);

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

      <Button text='Change password' type='primary' htmlType='button' onClick={() => handlePasswordChange()} />
    </>
  );
};

export default ChangePassword;
