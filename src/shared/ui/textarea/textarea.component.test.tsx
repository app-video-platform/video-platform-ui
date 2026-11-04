import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Textarea from './textarea.component';

it('associates each visible label with a unique textarea', async () => {
  const user = userEvent.setup();
  render(<>
    <Textarea label="Marketing description" value="First" readOnly />
    <Textarea label="Marketing description" value="Second" readOnly />
  </>);
  const fields = screen.getAllByRole('textbox', { name: 'Marketing description' });
  expect(fields[0].id).not.toBe(fields[1].id);
  await user.click(screen.getAllByText('Marketing description')[1]);
  expect(fields[1]).toHaveFocus();
});
