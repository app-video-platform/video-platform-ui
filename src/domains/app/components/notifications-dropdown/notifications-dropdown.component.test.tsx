import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom';
import NotificationsDropdown from './notifications-dropdown.component';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));

it('opens from the keyboard and distinguishes unread notifications', async () => {
  const user = userEvent.setup();
  const notifications = [
    { id: '1', title: 'New', message: 'First', isRead: false },
    { id: '2', title: 'Old', message: 'Second', isRead: true },
    { id: '3', title: 'Another', message: 'Third', isRead: false },
  ];
  (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
    selector({ auth: { user: { id: 'user' } }, notifications: { notifications } }),
  );
  render(<NotificationsDropdown />);
  const trigger = screen.getByRole('button', { name: 'Notifications' });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await user.tab();
  await user.keyboard('{Enter}');
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
  expect(panel).toBeInTheDocument();
  expect(within(panel as HTMLElement).getAllByText('Unread')).toHaveLength(2);
  expect(screen.getByText('Old').parentElement).not.toHaveTextContent('Unread');
  await user.keyboard('{Escape}');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

it('shows the empty state', async () => {
  (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
    selector({ auth: { user: { id: 'user' } }, notifications: { notifications: [] } }),
  );
  render(<NotificationsDropdown />);
  await userEvent.click(screen.getByRole('button', { name: 'Notifications' }));
  expect(screen.getByText('No notifications to show')).toBeInTheDocument();
});
