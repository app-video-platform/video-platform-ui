/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import Drawer from './drawer.component';

describe('<Drawer />', () => {
  it('closes on Escape', () => {
    const onClose = jest.fn();
    render(
      <Drawer open title="Details" onClose={onClose}>
        <button type="button">Inside</button>
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('restores focus to the trigger after close', () => {
    const { rerender } = render(
      <>
        <button type="button">Open drawer</button>
        <Drawer open title="Details" onClose={jest.fn()}>
          <button type="button">Inside</button>
        </Drawer>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Open drawer' });
    trigger.focus();

    rerender(
      <>
        <button type="button">Open drawer</button>
        <Drawer open={false} title="Details" onClose={jest.fn()}>
          <button type="button">Inside</button>
        </Drawer>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Open drawer' })).toHaveFocus();
  });
});
