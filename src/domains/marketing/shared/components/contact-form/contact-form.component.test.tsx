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
