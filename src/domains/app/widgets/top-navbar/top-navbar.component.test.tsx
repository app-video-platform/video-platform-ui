import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom';
import TopNavbar from './top-navbar.component';
import { UserRole } from 'core/api/models';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('domains/app/features/smart-search', () => ({ SmartSearch: () => <input aria-label="Product search" /> }));
jest.mock('domains/app/components', () => ({
  WishlistDropdown: () => <button type="button">Wishlist</button>,
  ShopCartDropdown: () => <button type="button">Cart</button>,
  NotificationsDropdown: () => <button type="button">Notifications</button>,
  UserDropdown: () => <button type="button">Account</button>,
}));

it('exposes guest search and navigation, and Escape closes its menu', async () => {
  (useSelector as unknown as jest.Mock).mockReturnValue(null);
  const user = userEvent.setup();
  render(<MemoryRouter><TopNavbar /></MemoryRouter>);
  expect(screen.getByRole('textbox', { name: 'Product search' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Explore' })).toHaveAttribute('href', '/app/explore');
  expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  const menu = screen.getByRole('button', { name: 'Menu' });
  await user.click(menu);
  expect(menu).toHaveAttribute('aria-expanded', 'true');
  await user.keyboard('{Escape}');
  expect(menu).toHaveAttribute('aria-expanded', 'false');
  expect(menu).toHaveFocus();
});

it('preserves authenticated customer collection actions', () => {
  (useSelector as unknown as jest.Mock).mockReturnValue({ roles: [UserRole.USER] });
  render(<MemoryRouter><TopNavbar /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'Library' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Wishlist' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cart' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
});
