import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { AppDispatch } from '../../store/store';
import FormInput from '../../components/form-input/form-input.component';
import { getUserProfile, signinUser } from '../../store/auth-store/auth.slice';
import Button from '../../components/button/button.component';

import './sign-in.styles.scss';

export interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignInFormData>({
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
    console.log('new errors', newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log('get here');

    e.preventDefault();
    if (validateForm()) {
      dispatch(signinUser(formData))
        .unwrap() // unwrap() turns the thunk result into a "normal" promise
        .then((value) => {
          // console.log(value);

          dispatch(getUserProfile()).unwrap().then(data => {
            if (data) {
              if (data.onboardingCompleted) {
                console.log('GO TO DASHBOARD FROM SIGN IN', data);
                navigate('dashboard');
              } else {
                console.log('GO TO ONBOARDING FROM SIGN IN', data);
                navigate('onboarding');
              }

            }
          });

        })
        .catch((error) => {
          // ❌ Failed signup, show error message
          console.error('Error signing ip', error);
        });
    }
  };


  return (
    <div>
      <div className='sign-up-container'>
        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-text-red">{errors.email}</p>}


          <div className='password-group'>
            <FormInput
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
          {errors.password && <p className="error-text-red">{errors.password}</p>}
          <Button type="primary" htmlType='submit' text='Sign In' />
        </form>

        <div className='forgot-password-button-container'>
          <button className='forgot-password-btn' onClick={() => navigate('/forgot-password')}>I forgot my password</button>

        </div>
      </div>
    </div>
  );
};


export default SignIn;