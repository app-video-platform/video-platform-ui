import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { AppDispatch } from 'core/api/models';
import { verifyEmail } from 'core/store/auth-store';

import './verify-email.styles.scss';

const VerifyEmail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'expired' | 'missing'
  >('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    let active = true;

    if (!token) {
      setStatus('missing');
      return () => {
        active = false;
      };
    }

    dispatch(verifyEmail(token))
      .unwrap()
      .then(() => {
        if (active) {
          setStatus('success');
        }
      })
      .catch((error) => {
        if (active) {
          const message = typeof error === 'string' ? error : '';
          setStatus(/expir/i.test(message) ? 'expired' : 'error');
        }
      });

    return () => {
      active = false;
    };
  }, [searchParams]);

  const messages = {
    loading: <p>Verifying your email…</p>,
    error: <p role="alert">This verification link is invalid or has already been used.</p>,
    missing: <p role="alert">This verification link is missing. Please check your email again.</p>,
    success: (
      <p>
        Email verified! You can now <a href="/auth/login">log in</a>.
      </p>
    ),
    expired: (
      <p role="alert">This verification link has expired. Please contact support to request a new link.</p>
    ),
  };

  return (
    <div className="verify-email-box" aria-live="polite">{messages[status]}</div>
  );
};

export default VerifyEmail;
