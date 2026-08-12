/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import httpClient from 'core/api/http-client';
import salesReducer from 'core/store/sales-store/sales.slice';
import { registerCreatorSalesTestMocks } from 'core/api/test-fixtures/creator-sales-http.mock';
import SalesPage from './sales-page.component';

const LocationProbe: React.FC = () => {
  const location = useLocation();
  return <span data-testid="location-search">{location.search}</span>;
};

describe('Creator Sales', () => {
  let mock: MockAdapter;

  const renderSales = (initialEntry = '/app/sales') => {
    const testStore = configureStore({
      reducer: {
        sales: salesReducer,
      },
    });

    return render(
      <Provider store={testStore}>
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
        </MemoryRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    registerCreatorSalesTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
  });

  it('renders Sales with period-aligned metrics and result count', async () => {
    renderSales();

    expect(screen.getByRole('heading', { name: 'Sales' })).toBeInTheDocument();
    expect(await screen.findByText('56 orders')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Failed payments')).toBeInTheDocument();
  });

  it('searches customer, email, or order ID', async () => {
    renderSales();

    await screen.findByText('56 orders');
    fireEvent.change(screen.getByLabelText('Search customer, email, or order ID'), {
      target: { value: 'mira.patel' },
    });

    expect(await screen.findByText('1 order')).toBeInTheDocument();
    expect(screen.getByText('Mira Patel')).toBeInTheDocument();
    expect(screen.queryByText('Maya Johnson')).toBeNull();
  });

  it('filters by status and product', async () => {
    renderSales();

    await screen.findByText('56 orders');
    fireEvent.change(screen.getByLabelText('Filter orders by status'), {
      target: { value: 'failed' },
    });
    fireEvent.change(screen.getByLabelText('Filter orders by product'), {
      target: { value: 'prod-membership-lab' },
    });

    expect(await screen.findByText('1 order')).toBeInTheDocument();
    const ledger = screen.getByRole('region', { name: 'Orders ledger' });
    expect(within(ledger).getByText('Mira Patel')).toBeInTheDocument();
    expect(within(ledger).getByText('Failed')).toBeInTheDocument();
  });

  it('filters by period and sorts by amount', async () => {
    renderSales();

    await screen.findByText('56 orders');
    fireEvent.change(screen.getByLabelText('Select sales date range'), {
      target: { value: '7d' },
    });
    expect(await screen.findByText('17 orders')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Sort orders'), {
      target: { value: 'amount-desc' },
    });
    await waitFor(() => {
      const openButtons = screen.getAllByRole('button', { name: /open ORD/i });
      expect(openButtons[0]).toHaveAccessibleName('Open ORD-2026-00119 order detail');
    });
  });

  it('renders search-empty and filter-empty states from API queries', async () => {
    const searchRender = renderSales();

    await screen.findByText('56 orders');
    fireEvent.change(screen.getByLabelText('Search customer, email, or order ID'), {
      target: { value: 'nobody@example.test' },
    });
    expect(
      await screen.findByText('No orders match "nobody@example.test".'),
    ).toBeInTheDocument();
    searchRender.unmount();

    renderSales();
    await screen.findByText('56 orders');
    fireEvent.change(screen.getByLabelText('Filter orders by status'), {
      target: { value: 'pending' },
    });
    fireEvent.change(screen.getByLabelText('Filter orders by product'), {
      target: { value: 'prod-membership-lab' },
    });
    expect(await screen.findByText('No orders match these filters.')).toBeInTheDocument();
  });

  it('opens order detail and reflects selection in URL state', async () => {
    renderSales();

    fireEvent.click(
      await screen.findByRole('button', { name: 'Open ORD-2026-00124 order detail' }),
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
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

  it('restores an order detail drawer from a deep link', async () => {
    renderSales('/app/sales?order=ORD-2026-00123');

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Order #ORD-2026-00123')).toBeInTheDocument();
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: 'Subscription' }),
    ).toBeInTheDocument();
    expect(within(dialog).getByText('€39 / month')).toBeInTheDocument();
  });

  it('renders refunded and failed order detail contexts', async () => {
    const { unmount } = renderSales('/app/sales?order=ORD-2026-00121');

    const refundDialog = await screen.findByRole('dialog');
    expect(within(refundDialog).getByText('Refund')).toBeInTheDocument();
    expect(within(refundDialog).getByText('Customer request')).toBeInTheDocument();
    expect(within(refundDialog).getAllByText('Access revoked').length).toBeGreaterThan(
      0,
    );
    unmount();

    renderSales('/app/sales?order=ORD-2026-00120');
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Failed payment')).toBeInTheDocument();
    expect(within(dialog).getByText('Card was declined.')).toBeInTheDocument();
    expect(within(dialog).getByText(/Retry scheduled/)).toBeInTheDocument();
  });

  it('links customer and product identities from ledger rows', async () => {
    renderSales();

    expect(
      await screen.findByRole('link', { name: 'Open Maya Johnson customer profile' }),
    ).toHaveAttribute('href', '/app/customers/cust-maya-johnson');
    expect(
      screen.getByRole('link', {
        name: 'Open Creator Product Growth System workspace',
      }),
    ).toHaveAttribute('href', '/app/products/edit/prod-course-growth');
  });

  it('renders honest unavailable state when the backend contract is missing', async () => {
    mock.resetHandlers();
    mock.onAny().reply(404);
    renderSales();

    expect(await screen.findByText('Sales data is not available yet')).toBeInTheDocument();
    expect(screen.queryByText('Maya Johnson')).toBeNull();
  });
});
