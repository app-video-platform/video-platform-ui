import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

import { getUserProfile, signinUser } from '@store/auth-store';
import SignIn from './sign-in.component';

// Mock react-redux and react-router-dom hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
// Mock auth thunks
jest.mock('@store/auth-store/auth.slice', () => ({
  signinUser: jest.fn(),
  getUserProfile: jest.fn(),
  logout: jest.fn(),
  logoutUser: jest.fn(),
}));

describe('SignIn component', () => {
  let mockDispatch: jest.Mock;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign in form with email and password inputs and a submit button', () => {
    render(<SignIn />);
    // Check that the email input is rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    // Check that the password input is rendered
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    // Check that the submit button is rendered (using GalButton component, so role "button")
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('shows validation errors for empty fields and invalid email format', async () => {
    render(<SignIn />);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    // Submit form with empty fields.
    fireEvent.click(signInButton);

    // Use findByText to wait for the error message to appear.
    const emailError = await screen.findByText(/Email is required/i);
    const passwordError = await screen.findByText(/Password is required/i);
    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();

    // Now provide an invalid email format.
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.click(signInButton);

    const invalidEmailError = await screen.findByText(/Invalid email format/i);
    expect(invalidEmailError).toBeInTheDocument();
  });

  it('submits the form and navigates to dashboard when onboardingCompleted is true', async () => {
    const dummyUserProfile = { onboardingCompleted: true };

    // Define two different thunk results.
    const mockThunkResultSignin = {
      unwrap: () => Promise.resolve(),
    };
    const mockThunkResultProfile = {
      unwrap: () => Promise.resolve(dummyUserProfile),
    };

    // Update the mocks for the thunk creators.
    (signinUser as unknown as jest.Mock).mockReturnValue(
      () => mockThunkResultSignin,
    );
    (getUserProfile as unknown as jest.Mock).mockReturnValue(
      () => mockThunkResultProfile,
    );

    // Set up the dispatch mock so that it returns our thunk results
    let callCount = 0;
    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') {
        callCount++;
        // First thunk call (signinUser) returns mockThunkResultSignin.
        if (callCount === 1) {
          return mockThunkResultSignin;
        }
        // Second thunk call (getUserProfile) returns mockThunkResultProfile.
        if (callCount === 2) {
          return mockThunkResultProfile;
        }
      }
      return action;
    });

    render(<SignIn />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verify that dispatch was called (at least two times for signinUser and getUserProfile).
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    // Verify navigation to dashboard.
    expect(mockNavigate).toHaveBeenCalledWith('/app');
  });

  it('submits the form with valid data and navigates to onboarding if onboardingCompleted is false', async () => {
    const dummyUserProfile = { onboardingCompleted: false };

    // Create mock thunk results with an unwrap method.
    const mockThunkResultSignin = {
      unwrap: () => Promise.resolve(),
    };
    const mockThunkResultProfile = {
      unwrap: () => Promise.resolve(dummyUserProfile),
    };

    // Update the thunk mocks to return functions that yield our mock thunk results.
    (signinUser as unknown as jest.Mock).mockReturnValue(
      () => mockThunkResultSignin,
    );
    (getUserProfile as unknown as jest.Mock).mockReturnValue(
      () => mockThunkResultProfile,
    );

    // Set up the dispatch mock so that when a thunk function is dispatched,
    // it returns the corresponding mock thunk result.
    let callCount = 0;
    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') {
        callCount++;
        if (callCount === 1) {
          return mockThunkResultSignin;
        }
        if (callCount === 2) {
          return mockThunkResultProfile;
        }
      }
      return action;
    });

    render(<SignIn />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(signinUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(getUserProfile).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });

  it('does not submit the form when validation fails', () => {
    render(<SignIn />);
    // Provide an invalid form state: empty email and password
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: '' } });
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    // Since validation fails, signinUser and getUserProfile should not be called.
    expect(signinUser).not.toHaveBeenCalled();
    expect(getUserProfile).not.toHaveBeenCalled();
  });
});
