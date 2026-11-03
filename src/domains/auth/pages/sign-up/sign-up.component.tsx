import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { RegisterRequest, AppDispatch } from 'core/api/models';
import { Input, Button } from '@shared/ui';
import { signupUser } from 'core/store/auth-store';
import { PasswordInput } from 'domains/app/components';

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      if (name === 'password' && formData.confirmPassword) {
        if (value !== formData.confirmPassword) {
          next.confirmPassword = 'Passwords do not match';
        } else {
          delete next.confirmPassword;
        }
      }
      if (name === 'confirmPassword' && value) {
        if (value !== formData.password) {
          next.confirmPassword = 'Passwords do not match';
        } else {
          delete next.confirmPassword;
        }
      }
      return next;
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) {
      return;
    }
    if (validateForm()) {
      const registerData: RegisterRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      submittingRef.current = true;
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await dispatch(signupUser(registerData)).unwrap();
        navigate('/auth/email-sent');
      } catch (error) {
        setSubmitError(
          typeof error === 'string'
            ? error
            : 'Registration could not be completed. Please check your details and try again.',
        );
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
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
          error={errors.firstName}
          disabled={isSubmitting}
          required
        />

        <Input
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          disabled={isSubmitting}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isSubmitting}
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          showRules={true}
          error={errors.password}
          disabled={isSubmitting}
          required
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          required
        />

        {submitError && <p className="auth-submit-error" role="alert">{submitError}</p>}
        {isSubmitting && <p role="status">Preparing secure registration…</p>}

        <Button type="submit" variant="primary" className="sign-up-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Signing up…' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
