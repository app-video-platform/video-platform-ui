// FormInput.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import FormInputX from './form-input.component';
import '@testing-library/jest-dom';

describe('FormInputX component', () => {
  it('renders the input element with the correct attributes', () => {
    render(<FormInputX name="email" value="" placeholder="Enter email" />);
    const inputElement = screen.getByTestId('input-email');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('name', 'email');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter email');
  });

  it('renders the textarea element with the correct attributes', () => {
    render(
      <FormInputX
        name="description"
        value=""
        placeholder="Describe here"
        inputType="textarea"
      />
    );
    const inputElement = screen.getByTestId('textarea-description');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('name', 'description');
    expect(inputElement).toHaveAttribute('placeholder', 'Describe here');
    expect(inputElement.tagName).toBe('TEXTAREA');
  });

  it('applies the required attribute when specified', () => {
    render(<FormInputX name="username" value="" required />);
    const inputElement = screen.getByTestId('input-username');
    expect(inputElement).toBeRequired();
  });

  it('renders the label when provided and associates it correctly with the input', () => {
    const { container } = render(
      <FormInputX name="firstName" label="First Name" value="" />
    );
    // Query the label directly using container
    const labelElement = container.querySelector('label');
    expect(labelElement).toBeInTheDocument();
    // Check that the label's htmlFor property (which corresponds to the "for" attribute) is set correctly
    expect(labelElement?.htmlFor).toBe('firstName');
  });

  it('adds the "shrink" class to the label when value is non-empty', () => {
    const { container } = render(
      <FormInputX name="lastName" label="Last Name" value="Doe" />
    );
    const labelElement = container.querySelector('label');
    expect(labelElement).toHaveClass('shrink');
  });

  it('does not add the "shrink" class to the label when value is empty', () => {
    const { container } = render(
      <FormInputX name="lastName" label="Last Name" value="" />
    );
    const labelElement = container.querySelector('label');
    expect(labelElement).not.toHaveClass('shrink');
  });

  it('displays the required asterisk in the label when required is true', () => {
    render(<FormInputX name="password" label="Password" value="" required />);
    // Query the label by its text content. This will return the label element.
    const labelElement = screen.getByText(/Password/i);
    expect(labelElement.textContent).toMatch(/\*/);
  });
});
