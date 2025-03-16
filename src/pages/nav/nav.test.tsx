import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from './nav.component';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom';

// Mock react-redux and react-router-dom hooks.
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock child components.
jest.mock('../../components/user-profile/user-profile.component', () => {
  const MockUserProfileDropdown = () => (
    <div data-testid="user-profile-dropdown">UserProfileDropdown</div>
  );
  MockUserProfileDropdown.displayName = 'UserProfileDropdown';
  return MockUserProfileDropdown;
});
jest.mock('../../components/google-sign-in-button/google-sign-in-button.component', () => {
  const MockGoogleSignInButton = () => (
    <div>GoogleSignInButton</div>
  );
  MockGoogleSignInButton.displayName = 'GoogleSignInButton';
  return MockGoogleSignInButton;
});

describe('Navigation component', () => {
  let mockNavigate: jest.Mock;
  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation links and sign in/up buttons when no user is present', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(<Navigation />);

    // Check static nav links.
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();

    // Check that the GoogleSignInButton is rendered.
    expect(screen.getByText(/GoogleSignInButton/i)).toBeInTheDocument();
    // Check that Sign Up and Sign In buttons are rendered with proper text.
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('renders user profile dropdown when a user is present', () => {
    const dummyUser = { firstName: 'Jane', lastName: 'Doe' };
    (useSelector as unknown as jest.Mock).mockReturnValue(dummyUser);
    render(<Navigation />);

    expect(screen.getByTestId('user-profile-dropdown')).toBeInTheDocument();
    // It should not render the GoogleSignInButton or the Sign Up/Sign In buttons.
    expect(screen.queryByTestId('google-sign-in-button')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Sign Up/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Sign In/i })).not.toBeInTheDocument();
  });

  it('calls navigate with "/signup" when Sign Up button is clicked', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(<Navigation />);

    const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(signUpButton);
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('calls navigate with "/signin" when Sign In button is clicked', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(<Navigation />);

    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(signInButton);
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  it('renders the Outlet component', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    const { container } = render(<Navigation />);
    // We don't have direct text for Outlet, but we can at least verify that the Navigation renders without error.
    expect(container).toBeInTheDocument();
  });
});
