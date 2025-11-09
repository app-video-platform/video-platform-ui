import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { GalGoogleSignInButton } from '@components';
import { LoginRequest } from '@api/models';
import { GalFormInput, GalButton } from '@shared/ui';
import { signinUser, getUserProfile } from '@store/auth-store';
import { AppDispatch } from '@store/store';

import './sign-in.styles.scss';

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
          <GalFormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-text-red">{errors.email}</p>}

          <div className="password-group">
            <GalFormInput
              label="Password"
              type={showPassword ? 'text' : 'password'} // Toggle input type
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => togglePasswordVisibility()}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="error-text-red">{errors.password}</p>
          )}
          <GalButton type="primary" htmlType="submit" text="Sign In" />
        </form>

        <GalGoogleSignInButton data-test-id="google-sign-in-button" />

        <div className="forgot-password-button-container">
          <button
            className="forgot-password-btn"
            onClick={() => navigate('/forgot-password')}
          >
            I forgot my password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
