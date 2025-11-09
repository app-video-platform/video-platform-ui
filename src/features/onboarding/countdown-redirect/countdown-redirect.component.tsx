import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { GalButton } from '@shared/ui';
import { AppDispatch } from '@store/store';
import { resetOnboarding } from '@store/auth-store';

const CountdownRedirect: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(10);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (seconds === 0) {
      navigate('/app'); // Replace with your target route
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // Cleanup the timeout when component unmounts or seconds changes
    return () => clearTimeout(timer);
  }, [seconds, navigate]);

  const handleReset = () => {
    setTimeout(() => {
      setSeconds(10); // Reset countdown to 10 seconds
      navigate('/onboarding'); // Navigate to the dashboard
      dispatch(resetOnboarding()); // Reset onboarding state if needed
    }, 300); // Reset countdown to 10 seconds
  };

  return (
    <div>
      <p>
        You have already completed your onboarding process. If you want to go
        through it again, or need help with the app, go to your settings page
        and look for Onboarding and Help
      </p>
      <p>You will be redirected to your dashboard in {seconds} seconds</p>;
      <p>
        Or you can{' '}
        <GalButton
          type="primary"
          text="go now"
          onClick={() => navigate('/app')}
        />
        <GalButton type="primary" text="RESET" onClick={handleReset} />
      </p>
    </div>
  );
};

export default CountdownRedirect;
