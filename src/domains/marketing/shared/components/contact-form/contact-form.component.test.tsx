import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ContactForm from './contact-form.component';

it('keeps the agreement checkbox in sync when toggled on and off', async () => {
  const user = userEvent.setup();
  render(<ContactForm />);
  const checkbox = screen.getByRole('checkbox', { name: 'I agree to the terms and conditions' });
  await user.click(checkbox);
  expect(checkbox).toBeChecked();
  await user.click(checkbox);
  expect(checkbox).not.toBeChecked();
});

it('supports Tab and Space while keeping the visual state synchronized', async () => {
  const user = userEvent.setup();
  render(<ContactForm />);
  const message = screen.getByRole('textbox', { name: 'Message' });
  const checkbox = screen.getByRole('checkbox', { name: 'I agree to the terms and conditions' });
  message.focus();
  await user.tab();
  expect(checkbox).toHaveFocus();
  await user.keyboard(' ');
  expect(checkbox).toBeChecked();
  expect(checkbox.closest('label')).toHaveClass('checked');
  await user.keyboard(' ');
  expect(checkbox).not.toBeChecked();
  expect(checkbox.closest('label')).not.toHaveClass('checked');
});
