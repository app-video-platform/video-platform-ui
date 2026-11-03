import React from 'react';
import { useSelector } from 'react-redux';

import { selectAuthUser } from 'core/store/auth-store';
import {
  CountdownRedirect,
  MultiStepForm,
} from 'domains/app/features/onboarding';

import './onboarding.styles.scss';

const Onboarding: React.FC = () => {
  const user = useSelector(selectAuthUser);

  return (
    <div className="onboarding-page">
      {!user?.onboardingCompleted ? (
        <MultiStepForm />
      ) : (
        <CountdownRedirect />
      )}
    </div>
  );
};

export default Onboarding;
