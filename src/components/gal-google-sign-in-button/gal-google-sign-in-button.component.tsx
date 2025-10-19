import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import {
  getUserProfile,
  googleSignInUser,
} from '../../store/auth-store/auth.slice';
import { useNavigate } from 'react-router-dom';

const GalGoogleSignInButton: React.FC = () => {
  const googleButton = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    // Make sure the script is loaded before trying to render the button
    const initializeGSI = () => {
      if (window.google && googleButton.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? '',
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(googleButton.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
        });
      }
    };

    if (window.google) {
      initializeGSI();
    } else {
      // Otherwise, wait for our custom event
      const onGsiLoaded = () => {
        initializeGSI();
      };
      window.addEventListener('gsi-loaded', onGsiLoaded);

      return () => {
        window.removeEventListener('gsi-loaded', onGsiLoaded);
      };
    }
  }, []);

  // Handle the ID token you get back from Google
  const handleCredentialResponse = (
    response: google.accounts.id.CredentialResponse,
  ) => {
    const idToken = response.credential;

    dispatch(googleSignInUser({ idToken: idToken }))
      .then((data) => {
        if (data) {
          dispatch(getUserProfile()).then((data) => {
            if (data) {
              navigate('/app');
            }
          });
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  };

  return <div ref={googleButton}></div>;
};

export default GalGoogleSignInButton;
