import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { verifyEmail } from '../../store/auth.slice';

const VerifyEmail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      return;
    }

    dispatch(verifyEmail(token));
    console.log('token', token);

    // axios.post('/api/verify-email', { token })
    //   .then(() => setStatus('success'))
    //   .catch((error) => {
    //     if (error.response?.data?.reason === 'expired') {
    //       setStatus('expired');
    //     } else {
    //       setStatus('error');
    //     }
    //   });
  }, [searchParams]);

  if (status === 'loading') { return <p>Verifying your email...</p>; }
  if (status === 'success') { return <p>Email verified! You can now <a href="/login">log in</a>.</p>; }
  if (status === 'expired') { return <p>This link has expired. <a href="/resend-verification">Resend email?</a></p>; }
  return <p>Invalid verification link. Please check your email again.</p>;
};

export default VerifyEmail;
