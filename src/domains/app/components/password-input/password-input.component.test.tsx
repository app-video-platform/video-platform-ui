import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import PasswordInput from './password-input.component';

describe('PasswordInput visibility control', () => {
  it('names the current action and preserves the field value while toggling', () => {
    render(
      <PasswordInput
        label="Password"
        name="password"
        value="Synthetic123!"
        onChange={() => undefined}
      />,
    );

    const field = screen.getByLabelText('Password') as HTMLInputElement;
    expect(field).toHaveAttribute('type', 'password');
    const show = screen.getByRole('button', { name: 'Show password' });
    expect(show).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(show);

    expect(field).toHaveAttribute('type', 'text');
    expect(field).toHaveValue('Synthetic123!');
    const hide = screen.getByRole('button', { name: 'Hide password' });
    expect(hide).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(hide);

    expect(field).toHaveAttribute('type', 'password');
    expect(field).toHaveValue('Synthetic123!');
  });
});
