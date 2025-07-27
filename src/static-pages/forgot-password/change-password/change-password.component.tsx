import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GalPasswordsContainer from '../../../components/gal-passwords-container/gal-passwords-container.component';
import GalButton from '../../../components/gal-button/gal-button.component';

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
      <GalPasswordsContainer
        passwordInput={formData.password}
        passwordErrors={errors.password}
        confirmPasswordInput={formData.confirmPassword}
        confirmPasswordErrors={errors.confirmPassword}
        handleChange={handleChange}
      />

      <GalButton
        text="Change password"
        type="primary"
        htmlType="button"
        onClick={() => handlePasswordChange()}
      />
    </>
  );
};

export default ChangePassword;
