import React, { useEffect, useState } from 'react';

import './onboarding.styles.scss';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import MultiStepForm from './multi-step-form/multi-step-form.component';
import { User } from '../../models/user/user';
import CountdownRedirect from './countdown-redirect/countdown-redirect.component';

const Onboarding: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const [otherUser, setOtherUser] = useState<User | null>(null);

  useEffect(() => {
    const mockUser: User = {
      email: 'myemail@domain.test',
      firstName: 'Gica',
      lastName: 'Hagi',
      role: ['User'],
      id: '',
      onboardingCompleted: false
    };
    if (user) {
      setOtherUser(user);
    } else {
      setOtherUser(mockUser);
    }

  }, [user]);

  return <div className='onboarding-page'>
    {
      !otherUser?.onboardingCompleted ? (
        <MultiStepForm />

      ) : (
        <CountdownRedirect />
      )
    }
  </div>;
};

export default Onboarding;