/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
        <Drawer open={false} title="Details" onClose={jest.fn()}>
          <button type="button">Inside</button>
        </Drawer>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Open drawer' });
    trigger.focus();

    rerender(
      <>
        <button type="button">Open drawer</button>
        <Drawer open title="Details" onClose={jest.fn()}>
          <button type="button">Inside</button>
        </Drawer>
      </>,
    );

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

  it('owns focus, Escape and scroll in stack order', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'scroll';
    const Example = () => {
      const [order, setOrder] = React.useState(false);
      const [filters, setFilters] = React.useState(false);
      return <>
        <button type="button" onClick={() => setOrder(true)}>Open order</button>
        <Drawer open={order} title="Order" onClose={() => setOrder(false)}>
          <button type="button" onClick={() => setFilters(true)}>Open filters</button>
          <Drawer open={filters} title="Filters" onClose={() => setFilters(false)}>
            <button type="button">Apply filters</button>
          </Drawer>
        </Drawer>
      </>;
    };
    const { unmount } = render(<React.StrictMode><Example /></React.StrictMode>);
    await user.click(screen.getByRole('button', { name: 'Open order' }));
    const order = screen.getByRole('dialog', { name: 'Order' });
    const orderId = order.getAttribute('aria-labelledby');
    expect(document.getElementById(orderId ?? '')).toHaveTextContent('Order');
    await user.click(within(order).getByRole('button', { name: 'Open filters' }));
    const filters = screen.getByRole('dialog', { name: 'Filters' });
    expect(filters.getAttribute('aria-labelledby')).not.toBe(orderId);
    expect(document.getElementById(filters.getAttribute('aria-labelledby') ?? '')).toHaveTextContent('Filters');
    expect(document.body.style.overflow).toBe('hidden');
    const first = within(filters).getByRole('button', { name: 'Close drawer' });
    const last = within(filters).getByRole('button', { name: 'Apply filters' });
    first.focus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Order' })).toBeInTheDocument();
    expect(within(order).getByRole('button', { name: 'Open filters' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    await user.click(within(order).getByRole('button', { name: 'Close drawer' }));
    expect(screen.getByRole('button', { name: 'Open order' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('scroll');
    await user.click(screen.getByRole('button', { name: 'Open order' }));
    unmount();
    expect(document.body.style.overflow).toBe('scroll');
    document.body.style.overflow = '';
  });
});
