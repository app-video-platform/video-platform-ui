// GalButton.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GalButton from './gal-button.component';
import '@testing-library/jest-dom';

describe('GalButton component', () => {
  it('renders a button with the provided text', () => {
    render(<GalButton text="Click me" type="neutral" htmlType="button" />);
    const buttonElement = screen.getByRole('button', { name: 'Click me' });
    expect(buttonElement).toBeInTheDocument();
  });

  it('applies the correct class based on the type prop', () => {
    const { rerender } = render(
      <GalButton text="Primary" type="primary" htmlType="button" />
    );
    let buttonElement = screen.getByRole('button', { name: 'Primary' });
    expect(buttonElement).toHaveClass('vp-button', 'vp-button--primary');

    rerender(<GalButton text="Secondary" type="secondary" htmlType="button" />);
    buttonElement = screen.getByRole('button', { name: 'Secondary' });
    expect(buttonElement).toHaveClass('vp-button', 'vp-button--secondary');
  });

  it('calls the onClick callback when clicked', () => {
    const handleClick = jest.fn();
    render(
      <GalButton
        text="Click me"
        type="primary"
        htmlType="button"
        onClick={handleClick}
      />
    );
    const buttonElement = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders the button with the specified htmlType attribute', () => {
    render(<GalButton text="Submit" type="primary" htmlType="submit" />);
    const buttonElement = screen.getByRole('button', { name: 'Submit' });
    expect(buttonElement.getAttribute('type')).toBe('submit');
  });

  it('renders a button without an onClick handler without error', () => {
    render(<GalButton text="No Click" type="neutral" htmlType="reset" />);
    const buttonElement = screen.getByRole('button', { name: 'No Click' });
    expect(buttonElement).toBeInTheDocument();
    // Clicking the button should not throw an error even though no onClick is provided.
    fireEvent.click(buttonElement);
  });
});
