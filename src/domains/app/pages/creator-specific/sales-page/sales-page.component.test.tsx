/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import SalesPage from './sales-page.component';

const LocationProbe: React.FC = () => {
  const location = useLocation();
  return <span data-testid="location-search">{location.search}</span>;
};

describe('Creator Sales', () => {
  const originalUseMocks = process.env.REACT_APP_USE_MOCKS;

  const renderSales = (initialEntry = '/app/sales') =>
    render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <LocationProbe />
        <Routes>
          <Route path="/app/sales" element={<SalesPage />} />
          <Route
            path="/app/customers/:customerId"
            element={<div>Customer detail route</div>}
          />
          <Route
            path="/app/products/edit/:productId"
            element={<div>Product workspace route</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

  beforeEach(() => {
    process.env.REACT_APP_USE_MOCKS = 'true';
    window.localStorage.removeItem('creator-sales-empty');
  });

  afterEach(() => {
    process.env.REACT_APP_USE_MOCKS = originalUseMocks;
    window.localStorage.removeItem('creator-sales-empty');
  });

  it('renders Sales with period-aligned metrics and result count', () => {
    renderSales();

    expect(screen.getByRole('heading', { name: 'Sales' })).toBeInTheDocument();
    expect(screen.getByText('8 orders')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Failed payments')).toBeInTheDocument();
  });

  it('searches customer, email, or order ID', () => {
    renderSales();

    fireEvent.change(screen.getByLabelText('Search customer, email, or order ID'), {
      target: { value: 'mira.patel' },
    });

    expect(screen.getByText('1 order')).toBeInTheDocument();
    expect(screen.getByText('Mira Patel')).toBeInTheDocument();
    expect(screen.queryByText('Maya Johnson')).toBeNull();
  });

  it('filters by status and product', () => {
    renderSales();

    fireEvent.change(screen.getByLabelText('Filter orders by status'), {
      target: { value: 'failed' },
    });
    fireEvent.change(screen.getByLabelText('Filter orders by product'), {
      target: { value: 'prod-membership-lab' },
    });

    expect(screen.getByText('1 order')).toBeInTheDocument();
    const ledger = screen.getByRole('region', { name: 'Orders ledger' });
    expect(within(ledger).getByText('Mira Patel')).toBeInTheDocument();
    expect(within(ledger).getByText('Failed')).toBeInTheDocument();
  });

  it('filters by period and sorts by amount', () => {
    renderSales();

    fireEvent.change(screen.getByLabelText('Select sales date range'), {
      target: { value: '7d' },
    });
    expect(screen.getByText('6 orders')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Sort orders'), {
      target: { value: 'amount-desc' },
    });
    const openButtons = screen.getAllByRole('button', { name: /open ORD/i });
    expect(openButtons[0]).toHaveAccessibleName('Open ORD-2026-00119 order detail');
  });

  it('renders true-empty, search-empty, and filter-empty states', () => {
    window.localStorage.setItem('creator-sales-empty', 'true');
    const emptyRender = renderSales();

    expect(screen.getByText('No sales yet')).toBeInTheDocument();
    emptyRender.unmount();

    window.localStorage.removeItem('creator-sales-empty');
    const searchRender = renderSales();
    fireEvent.change(screen.getByLabelText('Search customer, email, or order ID'), {
      target: { value: 'nobody@example.test' },
    });
    expect(
      screen.getByText('No orders match "nobody@example.test".'),
    ).toBeInTheDocument();
    searchRender.unmount();

    renderSales();
    fireEvent.change(screen.getByLabelText('Filter orders by status'), {
      target: { value: 'pending' },
    });
    fireEvent.change(screen.getByLabelText('Filter orders by product'), {
      target: { value: 'prod-membership-lab' },
    });
    expect(screen.getByText('No orders match these filters.')).toBeInTheDocument();
  });

  it('opens order detail and reflects selection in URL state', () => {
    renderSales();

    fireEvent.click(
      screen.getByRole('button', { name: 'Open ORD-2026-00124 order detail' }),
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Order #ORD-2026-00124')).toBeInTheDocument();
    expect(screen.getByText('Access granted')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'View customer' }),
    ).toHaveAttribute('href', '/app/customers/cust-maya-johnson');
    expect(screen.getByTestId('location-search')).toHaveTextContent(
      'order=ORD-2026-00124',
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Close drawer' })[1]);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('restores an order detail drawer from a deep link', () => {
    renderSales('/app/sales?order=ORD-2026-00123');

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Order #ORD-2026-00123')).toBeInTheDocument();
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: 'Subscription' }),
    ).toBeInTheDocument();
    expect(within(dialog).getByText('€39 / month')).toBeInTheDocument();
  });

  it('renders refunded and failed order detail contexts', () => {
    const { unmount } = renderSales('/app/sales?order=ORD-2026-00121');

    const refundDialog = screen.getByRole('dialog');
    expect(within(refundDialog).getByText('Refund')).toBeInTheDocument();
    expect(within(refundDialog).getByText('Customer request')).toBeInTheDocument();
    expect(within(refundDialog).getAllByText('Access revoked').length).toBeGreaterThan(
      0,
    );
    unmount();

    renderSales('/app/sales?order=ORD-2026-00120');
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Failed payment')).toBeInTheDocument();
    expect(within(dialog).getByText('Card was declined.')).toBeInTheDocument();
    expect(within(dialog).getByText(/Retry scheduled/)).toBeInTheDocument();
  });

  it('links customer and product identities from ledger rows', () => {
    renderSales();

    expect(
      screen.getByRole('link', { name: 'Open Maya Johnson customer profile' }),
    ).toHaveAttribute('href', '/app/customers/cust-maya-johnson');
    expect(
      screen.getByRole('link', {
        name: 'Open Creator Product Growth System workspace',
      }),
    ).toHaveAttribute('href', '/app/products/edit/prod-course-growth');
  });

  it('renders honest production unavailable state when inspection mocks are off', () => {
    process.env.REACT_APP_USE_MOCKS = 'false';
    renderSales();

    expect(screen.getByText('Sales data is not available yet')).toBeInTheDocument();
    expect(screen.queryByText('Maya Johnson')).toBeNull();
  });
});
