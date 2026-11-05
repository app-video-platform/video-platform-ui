import React from 'react';
import { act, render, screen } from '@testing-library/react';
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

it('updates the expanded height when observed content grows', () => {
  let update: () => void = () => undefined;
  const disconnect = jest.fn();
  const original = global.ResizeObserver;
  global.ResizeObserver = class {
    constructor(callback: ResizeObserverCallback) { update = () => callback([], this); }
    observe() { return undefined; }
    unobserve() { return undefined; }
    disconnect() { disconnect(); }
  };
  const height = jest.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(50);
  const { unmount } = render(<LegacyExpansionPanel header="Growing" defaultExpanded>Content</LegacyExpansionPanel>);
  const region = screen.getByRole('region', { name: 'Growing' });
  expect(region).toHaveStyle({ maxHeight: '50px' });
  height.mockReturnValue(90);
  act(() => update());
  expect(region).toHaveStyle({ maxHeight: '90px' });
  unmount();
  expect(disconnect).toHaveBeenCalled();
  height.mockRestore();
  global.ResizeObserver = original;
});

it('measures the initial expanded content and supports closing and reopening', async () => {
  const height = jest.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(120);
  const user = userEvent.setup();
  const { unmount } = render(
    <LegacyExpansionPanel header="Purchase history" defaultExpanded><p>Details</p></LegacyExpansionPanel>,
  );
  const button = screen.getByRole('button', { name: 'Purchase history' });
  const region = screen.getByRole('region', { name: 'Purchase history' });
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(region).toHaveStyle({ maxHeight: '120px' });
  await user.click(button);
  expect(region).toHaveStyle({ maxHeight: '0px' });
  button.focus();
  await user.keyboard('{Enter}');
  expect(region).toHaveStyle({ maxHeight: '120px' });
  unmount();
  height.mockRestore();
});
