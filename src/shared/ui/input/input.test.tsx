// Input.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './input.component';
import '@testing-library/jest-dom';

describe('Input component', () => {
  it('renders the input element with the correct attributes', () => {
    render(<Input name="email" value="" placeholder="Enter email" />);
    const inputElement = screen.getByTestId('input-email');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('name', 'email');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter email');
  });

  it('applies the required attribute when specified', () => {
    render(<Input name="username" value="" required />);
    const inputElement = screen.getByTestId('input-username');
    expect(inputElement).toBeRequired();
  });

  it('renders the label when provided and associates it correctly with the input', () => {
    const { container } = render(
      <Input name="firstName" label="First Name" value="" />,
    );
    // Query the label directly using container
    const labelElement = container.querySelector('label');
    expect(labelElement).toBeInTheDocument();
    // Check that the label's htmlFor property (which corresponds to the "for" attribute) is set correctly
    expect(labelElement?.htmlFor).toBe('firstName');
  });
});
