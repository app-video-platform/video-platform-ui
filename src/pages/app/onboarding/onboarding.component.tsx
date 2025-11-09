import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectAuthUser } from '@store/auth-store';
import { User, UserRole } from '@api/models';
import { CountdownRedirect, MultiStepForm } from '@features/onboarding';

import './onboarding.styles.scss';

const Onboarding: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const [otherUser, setOtherUser] = useState<User | null>(null);

  useEffect(() => {
    const mockUser: User = {
      email: 'myemail@domain.test',
      firstName: 'Gica',
      lastName: 'Hagi',
      roles: [UserRole.USER],
      id: '',
      onboardingCompleted: false,
    };
    if (user) {
      setOtherUser(user);
    } else {
      setOtherUser(mockUser);
    }
  }, [user]);

  return (
    <div className="onboarding-page">
      {!otherUser?.onboardingCompleted ? (
        <MultiStepForm />
      ) : (
        <CountdownRedirect />
      )}
    </div>
  );
};

export default Onboarding;
