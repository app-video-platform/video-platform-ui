// FormInput.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import FormInput from './form-input.component';
import '@testing-library/jest-dom';

describe('FormInput component', () => {
  it('renders the input element with the correct attributes', () => {
    render(<FormInput name="email" value="" placeholder="Enter email" />);
    const inputElement = screen.getByTestId('input-email');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('name', 'email');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter email');
  });

  it('applies the required attribute when specified', () => {
    render(<FormInput name="username" value="" required />);
    const inputElement = screen.getByTestId('input-username');
    expect(inputElement).toBeRequired();
  });

  it('renders the label when provided and associates it correctly with the input', () => {
    const { container } = render(<FormInput name="firstName" label="First Name" value="" />);
    // Query the label directly using container
    const labelElement = container.querySelector('label');
    expect(labelElement).toBeInTheDocument();
    // Check that the label's htmlFor property (which corresponds to the "for" attribute) is set correctly
    expect(labelElement?.htmlFor).toBe('firstName');
  });

  it('adds the "shrink" class to the label when value is non-empty', () => {
    const { container } = render(<FormInput name="lastName" label="Last Name" value="Doe" />);
    const labelElement = container.querySelector('label');
    expect(labelElement).toHaveClass('shrink');
  });

  it('does not add the "shrink" class to the label when value is empty', () => {
    const { container } = render(<FormInput name="lastName" label="Last Name" value="" />);
    const labelElement = container.querySelector('label');
    expect(labelElement).not.toHaveClass('shrink');
  });

  it('displays the required asterisk in the label when required is true', () => {
    render(<FormInput name="password" label="Password" value="" required />);
    // Query the label by its text content. This will return the label element.
    const labelElement = screen.getByText(/Password/i);
    expect(labelElement.textContent).toMatch(/\*/);
  });
});
