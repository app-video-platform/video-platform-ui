import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GalButton from '../../../components/gal-button/gal-button.component';

const CountdownRedirect: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (seconds === 0) {
      navigate('/dashboard'); // Replace with your target route
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // Cleanup the timeout when component unmounts or seconds changes
    return () => clearTimeout(timer);
  }, [seconds, navigate]);

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
          onClick={() => navigate('/dashboard')}
        />
      </p>
    </div>
  );
};

export default CountdownRedirect;
