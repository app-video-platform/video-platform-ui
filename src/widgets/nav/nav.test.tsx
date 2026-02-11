import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from './nav.component';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom';

// Mock react-redux and react-router-dom hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock child components
jest.mock('@features/dropdowns', () => {
  const actual = jest.requireActual('@features/dropdowns');
  return {
    ...actual,
    UserDropdown: () => (
      <div data-testid="user-profile-dropdown">UserDropdown</div>
    ),
  };
});

jest.mock('@shared/components', () => {
  const actual = jest.requireActual('@shared/components');
  return {
    ...actual,
    VPFooter: () => <footer data-testid="footer">VPFooter</footer>,
  };
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

  it('renders navigation links and Register/Sign In buttons when no user is present', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(<Navigation />);

    // Check updated nav links
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Pricing/i)).toBeInTheDocument();
    expect(screen.getByText(/Galactica App/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();

    // Check buttons
    expect(
      screen.getByRole('button', { name: /Register/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign In/i }),
    ).toBeInTheDocument();
  });

  it('renders user profile dropdown when a user is present', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue({
      firstName: 'Jane',
    });
    render(<Navigation />);

    expect(screen.getByTestId('user-profile-dropdown')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Register/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Sign In/i }),
    ).not.toBeInTheDocument();
  });

  it('calls navigate with "/signup" when Register button is clicked', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(<Navigation />);

    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerButton);
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('calls navigate with "/signin" when Sign In button is clicked', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(<Navigation />);

    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(signInButton);
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  it('renders the Outlet and VPFooter component', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(<Navigation />);

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
