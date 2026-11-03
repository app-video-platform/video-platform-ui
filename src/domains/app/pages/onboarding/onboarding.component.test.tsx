import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector } from 'react-redux';

import Onboarding from './onboarding.component';
import { UserRole } from '@core/api';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('domains/app/features/onboarding', () => ({
  CountdownRedirect: () => <div>Completed onboarding redirect</div>,
  MultiStepForm: () => <div>Onboarding wizard</div>,
}));

const incompleteUser = {
  id: 'creator-1',
  firstName: 'Creator',
  lastName: 'One',
  email: 'creator@example.test',
  roles: [UserRole.CREATOR],
  onboardingCompleted: false,
};
const completedUser = { ...incompleteUser, onboardingCompleted: true };

describe('Onboarding profile eligibility', () => {
  it('shows the wizard for an incomplete profile', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        auth: { user: incompleteUser },
      }),
    );

    render(<Onboarding />);

    expect(screen.getByText('Onboarding wizard')).toBeInTheDocument();
  });

  it('keeps the established completed-profile redirect policy', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        auth: { user: completedUser },
      }),
    );

    render(<Onboarding />);

    expect(
      await screen.findByText('Completed onboarding redirect'),
    ).toBeInTheDocument();
  });
});
