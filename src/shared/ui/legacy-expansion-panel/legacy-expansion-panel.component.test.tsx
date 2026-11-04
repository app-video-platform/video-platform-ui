import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LegacyExpansionPanel from './legacy-expansion-panel.component';

it('associates each course section with its own expanded region', async () => {
  render(<>
    <LegacyExpansionPanel header="Section one"><p>Article one</p></LegacyExpansionPanel>
    <LegacyExpansionPanel header="Section two"><p>Article two</p></LegacyExpansionPanel>
  </>);
  const first = screen.getByRole('button', { name: 'Section one' });
  const second = screen.getByRole('button', { name: 'Section two' });
  expect(first.getAttribute('aria-controls')).not.toBe(second.getAttribute('aria-controls'));
  await userEvent.click(first);
  expect(first).toHaveAttribute('aria-expanded', 'true');
  expect(document.getElementById(first.getAttribute('aria-controls') ?? '')).toHaveAccessibleName('Section one');
});
