import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import UserDropdown from './user-dropdown.component';
import { useDispatch, useSelector } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { UserRole } from 'core/api/models';
import { logout } from 'core/store/auth-store';

// Mock react-redux and react-router-dom hooks
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  return {
    ...actual,
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
  };
});

describe('UserDropdown component', () => {
  const dummyUser = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    roles: [UserRole.ADMIN, UserRole.USER],
    imageUrl: '',
  };

  let mockDispatch: jest.Mock;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    // By default, mock useSelector to return a dummy user.
    (useSelector as unknown as jest.Mock).mockReturnValue(dummyUser);
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when no user is available', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
    const { container } = render(<UserDropdown />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the user profile button and toggles dropdown on click', () => {
    render(
      <MemoryRouter>
        <UserDropdown />
      </MemoryRouter>,
    );
    // Verify the profile button displays the user's first and last name.
    const profileButton = screen.getByRole('button', { name: /jd/i });
    expect(profileButton).toBeInTheDocument();

    // Initially, the dropdown menu should not be visible.
    expect(screen.queryByText(/john\.doe@example\.com/i)).toBeNull();

    // Click the profile button to toggle dropdown open.
    fireEvent.click(profileButton);
    expect(screen.getByText(/john\.doe@example\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/role: admin/i)).toBeInTheDocument();
    expect(screen.getByText(/change role \(for dev\):/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: UserRole.CREATOR })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: UserRole.USER })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: UserRole.ADMIN })).toBeNull();
  });

  it('dispatches backend-backed dev role changes from the role switcher', () => {
    render(
      <MemoryRouter>
        <UserDropdown />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /jd/i }));
    fireEvent.click(screen.getByRole('button', { name: UserRole.CREATOR }));

    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  it('closes the dropdown when clicking outside', () => {
    render(
      <MemoryRouter>
        <UserDropdown />
      </MemoryRouter>,
    );
    const profileButton = screen.getByRole('button', { name: /jd/i });
    // Open the dropdown.
    fireEvent.click(profileButton);
    expect(screen.getByText(/john\.doe@example\.com/i)).toBeInTheDocument();

    // Simulate a click outside by dispatching a mousedown event on the document.
    fireEvent.mouseDown(document);
    expect(screen.queryByText(/john\.doe@example\.com/i)).toBeNull();
  });

  it('handles logout correctly', async () => {
    // For the logout actions, simulate that dispatch(logoutUser()) returns an object with an unwrap method that resolves.
    mockDispatch.mockReturnValueOnce(undefined); // For dispatch(logout())
    mockDispatch.mockReturnValueOnce({ unwrap: () => Promise.resolve() }); // For dispatch(logoutUser())

    render(
      <MemoryRouter>
        <UserDropdown />
      </MemoryRouter>,
    );
    const profileButton = screen.getByRole('button', { name: /jd/i });
    // Open the dropdown.
    fireEvent.click(profileButton);

    const logoutBtn = screen.getByText(/logout/i);
    // Click logout within an act block to await promise resolution.
    await act(async () => {
      fireEvent.click(logoutBtn);
    });

    // Verify that logout actions were dispatched.
    expect(mockDispatch).toHaveBeenCalledWith(logout());
    expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function));

    // Verify navigation to '/'.
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it.each(['{Enter}', ' '])('allows keyboard logout with %s', async (key) => {
    const user = userEvent.setup();
    mockDispatch.mockReturnValueOnce(undefined).mockReturnValueOnce({ unwrap: () => Promise.resolve() });
    render(<MemoryRouter><UserDropdown /></MemoryRouter>);
    await user.tab();
    await user.keyboard('{Enter}');
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    for (let i = 0; i < 10 && document.activeElement !== logoutButton; i += 1) {
      await user.tab();
    }
    expect(logoutButton).toHaveFocus();
    await user.keyboard(key);
    expect(mockDispatch).toHaveBeenCalledWith(logout());
  });

  it('dismisses the menu with Escape without signing out', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><UserDropdown /></MemoryRouter>);
    await user.tab();
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('button', { name: 'Logout' })).toBeNull();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
