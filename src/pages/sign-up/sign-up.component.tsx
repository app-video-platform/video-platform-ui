import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import FormInput from '../../components/form-input/form-input.component';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { signupUser } from '../../store/auth-store/auth.slice';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/button.component';
import { UserRegisterData } from '../../api/models/user/user';

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
    } else {
      const failedRules = passwordValidationRules.filter(
        (rule) => !rule.test(formData.password)
      );
      if (failedRules.length > 0) {
        newErrors.password = 'Password does not meet all requirements';
      }
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field], // Toggle the specific field
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const registerData: UserRegisterData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      dispatch(signupUser(registerData))
        .unwrap() // unwrap() turns the thunk result into a "normal" promise
        .then(() => {
          navigate('/email-sent'); // example redirect (requires useNavigate)
        })
        .catch((error) => {
          // ❌ Failed signup, show error message
          console.error('Error signing up', error);
        });
    }
  };

  return (
    <div>
      <div className="sign-up-container">
        <h1 className="text-2xl font-bold mb-4" data-testid="sign-up-header">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit}>
          <FormInput
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

          <FormInput
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && (
            <p className="error-text-red">{errors.lastName}</p>
          )}

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-text-red">{errors.email}</p>}

          <div className="password-group">
            <FormInput
              label="Password"
              type={showPassword.password ? 'text' : 'password'} // Toggle input type
              name="password"
              value={formData.password}
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
          {errors.password && (
            <p className="error-text-red">{errors.password}</p>
          )}
          {isPasswordFocused && (
            <ul className="password-rules">
              {passwordValidationRules.map((rule) => (
                <li
                  key={rule.id}
                  className={`password-rule ${
                    isPasswordFocused ? 'red' : 'grey'
                  } ${rule.test(formData.password) ? 'green' : ''}`}
                >
                  {rule.label}
                </li>
              ))}
            </ul>
          )}
          <div className="password-group">
            <FormInput
              label="Confirm Password"
              type={showPassword.confirmPassword ? 'text' : 'password'} // Toggle input type
              name="confirmPassword"
              value={formData.confirmPassword}
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
          {errors.confirmPassword && (
            <p className="error-text-red">{errors.confirmPassword}</p>
          )}

          <Button text="Sign Up" htmlType="submit" type="primary" />
        </form>
      </div>
    </div>
  );
};

export default SignUp;
