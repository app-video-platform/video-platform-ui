import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { verifyEmail } from '../../store/auth.slice';

import './verify-email.styles.scss';

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

    dispatch(verifyEmail(token))
      .then(() => setStatus('success'))
      .catch((error) => {
        if (error.response?.data.reason === 'expired') {
          setStatus('expired');
        } else {
          setStatus('error');
        }
      });
  }, [searchParams]);

  const messages = {
    loading: <p>Invalid verification link. Please check your email again.</p>,
    error: <p>Invalid verification link. Please check your email again.</p>,
    success: <p>Email verified! You can now <a href="/login">log in</a>.</p>,
    expired: <p>This link has expired. <a href="/resend-verification">Resend email?</a></p>
  };


  // if (status === 'loading') { return <p>Verifying your email...</p>; }
  // if (status === 'success') { return <p>Email verified! You can now <a href="/login">log in</a>.</p>; }
  // if (status === 'expired') { return <p>This link has expired. <a href="/resend-verification">Resend email?</a></p>; }
  return (
    <div className="verify-email-box">
      {status ? messages[status] : null}
    </div>
  );
};

export default VerifyEmail;
