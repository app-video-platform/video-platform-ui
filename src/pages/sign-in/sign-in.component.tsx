import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store/store';
import { Eye, EyeOff } from 'lucide-react';
import FormInput from '../../components/form-input/form-input.component';
import { getUserProfile, signinUser } from '../../store/auth.slice';

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(signinUser(formData))
        .unwrap() // unwrap() turns the thunk result into a "normal" promise
        .then((value) => {
          console.log(value);

          dispatch(getUserProfile());

          navigate('/');  // example redirect (requires useNavigate)
        })
        .catch((error) => {
          // ❌ Failed signup, show error message
          console.error('Error signing up', error);
        });
    }
  };


  return (
    <div>
      <div className='sign-up-container'>
        <form onSubmit={handleSubmit}>
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
          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition" type="submit">
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
};


export default SignIn;