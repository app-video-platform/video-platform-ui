import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { RegisterRequest, AppDispatch } from '@api/models';
import { Input, Button } from '@shared/ui';
import { signupUser } from '@store/auth-store';
import { PasswordInput } from '@shared/components';

import './sign-up.styles.scss';

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const registerData: RegisterRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      dispatch(signupUser(registerData))
        .unwrap() // unwrap() turns the thunk result into a "normal" promise
        .then(() => {
          navigate('/email-sent'); // example redirect (requires useNavigate)
        });
    }
  };

  return (
    <div className="sign-up-container">
      <h1 className="text-2xl font-bold mb-4" data-testid="sign-up-header">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="First Name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        {errors.firstName && (
          <p className="error-text-red">{errors.firstName}</p>
        )}

        <Input
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        {errors.lastName && <p className="error-text-red">{errors.lastName}</p>}

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error-text-red">{errors.email}</p>}

        <PasswordInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          showRules={true}
          required
        />
        {errors.password && <p className="error-text-red">{errors.password}</p>}

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {errors.confirmPassword && (
          <p className="error-text-red">{errors.confirmPassword}</p>
        )}

        <Button type="submit" variant="primary" className="sign-up-btn">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
