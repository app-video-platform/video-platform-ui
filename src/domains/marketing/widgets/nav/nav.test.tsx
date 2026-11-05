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
const mockLocation = { pathname: '/' };
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: () => mockLocation,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock('domains/app/components', () => ({
  __esModule: true,
  NavDropdown: () => null,
  UserDropdown: () => (
    <div data-testid="user-profile-dropdown">UserDropdown</div>
  ),
}));

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
    expect(screen.getByText(/Getting Started/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();

    // Check buttons
    expect(
      screen.getByRole('button', { name: /Register/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign In/i }),
    ).toBeInTheDocument();
  });

  it('opens and dismisses navigation with Escape, restoring focus', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(<Navigation />);
    const trigger = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('does not show guest actions while the session is resolving', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ auth: { user: null, sessionStatus: 'resolving' } }),
    );
    render(<Navigation />);
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument();
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

  it('calls navigate with "/auth/signup" when Register button is clicked', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(<Navigation />);

    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerButton);
    expect(mockNavigate).toHaveBeenCalledWith('/auth/signup');
  });

  it('calls navigate with "/auth/login" when Sign In button is clicked', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(<Navigation />);

    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(signInButton);
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });
});
