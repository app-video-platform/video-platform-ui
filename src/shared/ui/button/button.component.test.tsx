import React from 'react';
import { render, screen } from '@testing-library/react';

import Button from './button.component';

describe('<Button />', () => {
  it('renders label content and semantic classes', () => {
    render(
      <Button variant="destructive" size="lg" label="Delete product" />,
    );

    const button = screen.getByRole('button', { name: 'Delete product' });
    expect(button.className).toContain('vp-btn__destructive');
    expect(button.className).toContain('vp-btn__size-lg');
  });

  it('preserves content width while exposing loading state', () => {
    render(<Button loading>Publish</Button>);

    const button = screen.getByRole('button', { name: 'Publish' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole('status', { name: 'Loading' })).toBeTruthy();
  });

  it('composes leading and trailing icons around children', () => {
    render(
      <Button
        leadingIcon={<span data-testid="leading-icon" />}
        trailingIcon={<span data-testid="trailing-icon" />}
      >
        Preview
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Preview' })).toBeTruthy();
    expect(screen.getByTestId('leading-icon')).toBeTruthy();
    expect(screen.getByTestId('trailing-icon')).toBeTruthy();
  });
});
