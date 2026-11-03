import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { GoogleSignInButton, PasswordInput } from 'domains/app/components';
import { LoginRequest, AppDispatch } from 'core/api/models';
import { Input, Button } from '@shared/ui';
import { signinUser, getUserProfile } from 'core/store/auth-store';

import './sign-in.styles.scss';

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      if (name === 'email' && prev.email) {
        if (!value) {
          next.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          next.email = 'Invalid email format';
        } else {
          delete next.email;
        }
      } else if (name === 'password' && prev.password) {
        if (!value) {
          next.password = 'Password is required';
        } else {
          delete next.password;
        }
      }
      return next;
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(signinUser(formData))
        .unwrap() // unwrap() turns the thunk result into a "normal" promise
        .then(() => {
          dispatch(getUserProfile())
            .unwrap()
            .then((data) => {
              if (data) {
                if (data.onboardingCompleted) {
                  navigate('/app');
                } else {
                  navigate('/onboarding');
                }
              }
            });
        });
    }
  };

  return (
    <div>
      <div className="sign-up-container">
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <Button variant="primary" type="submit">
            Sign in
          </Button>
        </form>

        <GoogleSignInButton data-test-id="google-sign-in-button" />

        <div className="forgot-password-button-container">
          <button
            className="forgot-password-btn"
            onClick={() => navigate('/auth/forgot-password')}
          >
            I forgot my password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
