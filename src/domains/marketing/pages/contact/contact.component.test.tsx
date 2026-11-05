import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Contact from './contact.component';

jest.mock('@domains/marketing/shared', () => ({
  ContactForm: () => null,
  CTASection: () => null,
}));

it('provides and scrolls to the FAQ fragment on direct navigation', () => {
  const scroll = jest.fn();
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scroll });
  render(<MemoryRouter initialEntries={['/contact#faq']}><Contact /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Frequently Asked Questions' }).closest('section')).toHaveAttribute('id', 'faq');
  expect(scroll).toHaveBeenCalled();
});
