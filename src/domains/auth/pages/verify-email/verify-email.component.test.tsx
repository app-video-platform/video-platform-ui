import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '@testing-library/jest-dom';

import VerifyEmail from './verify-email.component';
import { verifyEmail } from 'core/store/auth-store';

jest.mock('react-redux', () => ({ useDispatch: jest.fn() }));
jest.mock('@store/auth-store/auth.slice', () => ({ verifyEmail: jest.fn() }));

describe('VerifyEmail result handling', () => {
  const dispatch = jest.fn();
  const renderAt = (url: string) =>
    render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
        </Routes>
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
  });

  it('shows success and login navigation only after a fulfilled thunk', async () => {
    const result = { unwrap: () => Promise.resolve('Email verified') };
    (verifyEmail as unknown as jest.Mock).mockReturnValue('verify-action');
    dispatch.mockReturnValue(result);
    renderAt('/auth/verify-email?token=synthetic-valid-token');

    expect(await screen.findByText(/email verified/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute(
      'href',
      '/auth/login',
    );
    expect(dispatch).toHaveBeenCalledWith('verify-action');
  });

  it.each([
    ['invalid or used token', 'Invalid token!', /invalid or has already been used/i],
    ['expired token', 'Token expired!', /verification link has expired/i],
  ])('shows the rejected outcome for an %s', async (_case, reason, expected) => {
    (verifyEmail as unknown as jest.Mock).mockReturnValue('verify-action');
    dispatch.mockReturnValue({ unwrap: () => Promise.reject(reason) });
    renderAt('/auth/verify-email?token=synthetic-rejected-token');

    expect(await screen.findByRole('alert')).toHaveTextContent(expected);
    expect(screen.queryByText(/email verified/i)).not.toBeInTheDocument();
  });

  it('shows missing-token guidance without calling the thunk', async () => {
    renderAt('/auth/verify-email');

    expect(await screen.findByRole('alert')).toHaveTextContent(/verification link is missing/i);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
