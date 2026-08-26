/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import httpClient from 'core/api/http-client';
import customersReducer from 'core/store/customers-store/customers.slice';
import { registerCreatorCustomersTestMocks } from 'core/api/test-fixtures/creator-customers-http.mock';
import CustomersList from './customers-list.component';
import CustomerDetail from './customer-detail.component';

describe('Creator Customers', () => {
  let mock: MockAdapter;

  const renderWithStore = (ui: React.ReactElement) => {
    const testStore = configureStore({
      reducer: {
        customers: customersReducer,
      },
    });

    return render(<Provider store={testStore}>{ui}</Provider>);
  };

  const renderList = () =>
    renderWithStore(
      <MemoryRouter initialEntries={['/app/customers']}>
        <Routes>
          <Route path="/app/customers" element={<CustomersList />} />
          <Route
            path="/app/customers/:customerId"
            element={<div>Customer detail route</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

  const renderDetail = (customerId = 'cust-maya-johnson') =>
    renderWithStore(
      <MemoryRouter initialEntries={[`/app/customers/${customerId}`]}>
        <Routes>
          <Route path="/app/customers" element={<CustomersList />} />
          <Route path="/app/customers/:customerId" element={<CustomerDetail />} />
        </Routes>
      </MemoryRouter>,
    );

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    registerCreatorCustomersTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
  });

  it('renders the Customers route with mocked HTTP customers and result count', async () => {
    renderList();

    expect(screen.getByRole('heading', { name: 'Customers' })).toBeInTheDocument();
    expect(await screen.findByText('8 customers')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Open Maya Johnson customer profile' }),
    ).toBeInTheDocument();
  });

  it('searches by name or email and updates the result count', async () => {
    renderList();

    await screen.findByText('8 customers');
    fireEvent.change(screen.getByLabelText('Search by name or email'), {
      target: { value: 'mira' },
    });

    expect(await screen.findByText('1 customer')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Open Mira Patel customer profile' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Open Maya Johnson customer profile' }),
    ).toBeNull();
  });

  it('filters by relationship status, product, and membership state', async () => {
    renderList();

    await screen.findByText('8 customers');
    fireEvent.change(screen.getByLabelText('Filter by relationship status'), {
      target: { value: 'past-due' },
    });
    fireEvent.change(screen.getByLabelText('Filter by product'), {
      target: { value: 'prod-membership-lab' },
    });
    fireEvent.change(screen.getByLabelText('Filter by membership state'), {
      target: { value: 'past_due' },
    });

    expect(await screen.findByText('1 customer')).toBeInTheDocument();
    const miraRow = screen
      .getByRole('link', { name: 'Open Mira Patel customer profile' })
      .closest('article');
    expect(miraRow).not.toBeNull();
    expect(within(miraRow as HTMLElement).getByText('Past due')).toBeInTheDocument();
  });

  it('sorts customers by total spend', async () => {
    renderList();

    await screen.findByText('8 customers');
    fireEvent.change(screen.getByLabelText('Sort customers'), {
      target: { value: 'spend-asc' },
    });

    await waitFor(() => {
      const customerLinks = screen.getAllByRole('link', {
        name: /open .* customer profile/i,
      });
      expect(customerLinks[0]).toHaveAccessibleName(
        'Open Elena Garcia customer profile',
      );
    });
  });

  it('links customer identity to the dedicated Customer Detail route', async () => {
    renderList();

    expect(
      await screen.findByRole('link', { name: 'Open Maya Johnson customer profile' }),
    ).toHaveAttribute('href', '/app/customers/cust-maya-johnson');
  });

  it('renders search-empty and filter-empty states from API queries', async () => {
    const rendered = renderList();

    await screen.findByText('8 customers');
    fireEvent.change(screen.getByLabelText('Search by name or email'), {
      target: { value: 'zara' },
    });
    expect(await screen.findByText('No customers match "zara".')).toBeInTheDocument();
    rendered.unmount();

    renderList();
    await screen.findByText('8 customers');
    fireEvent.change(screen.getByLabelText('Filter by relationship status'), {
      target: { value: 'waitlist' },
    });
    fireEvent.change(screen.getByLabelText('Filter by product'), {
      target: { value: 'prod-course-growth' },
    });
    expect(
      await screen.findByText('No customers match these filters.'),
    ).toBeInTheDocument();
  });

  it('renders relationship status and total-spend formatting', async () => {
    renderList();

    const mayaLink = await screen.findByRole('link', {
      name: 'Open Maya Johnson customer profile',
    });
    const mayaRow = mayaLink.closest('article');

    expect(mayaRow).not.toBeNull();
    expect(within(mayaRow as HTMLElement).getByText('Active member')).toBeInTheDocument();
    expect(within(mayaRow as HTMLElement).getByText('€1,249')).toBeInTheDocument();
  });

  it('loads the correct customer detail header and tabs', async () => {
    renderDetail('cust-maya-johnson');

    expect(await screen.findByRole('heading', { name: 'Maya Johnson' })).toBeInTheDocument();
    expect(screen.getAllByText('maya.johnson@example.test').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Active member').length).toBeGreaterThan(0);

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Purchases' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Access' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Notes' })).toBeInTheDocument();
  });

  it('renders Purchases, Access, and Notes tab states', async () => {
    renderDetail('cust-maya-johnson');

    await screen.findByRole('heading', { name: 'Maya Johnson' });
    fireEvent.click(screen.getByRole('tab', { name: 'Purchases' }));
    expect(screen.getByRole('heading', { name: 'Purchases' })).toBeInTheDocument();
    expect(screen.getAllByText('Paid')[0]).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Access' }));
    expect(screen.getByRole('heading', { name: 'Access' })).toBeInTheDocument();
    expect(screen.getByText('Manual grant')).toBeInTheDocument();
    expect(screen.getByText('Free enrollment')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Notes' }));
    expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument();
    expect(
      screen.getByText(/Prefers launch planning examples/i),
    ).toBeInTheDocument();
  });

  it('renders honest unavailable state when the backend contract is missing', async () => {
    mock.resetHandlers();
    mock.onAny().reply(404);

    const { unmount } = renderList();

    expect(
      await screen.findByText('Customer data is not available yet'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Maya Johnson')).toBeNull();
    unmount();

    renderDetail('cust-maya-johnson');
    expect(
      await screen.findByText('Customer profile data is not available yet'),
    ).toBeInTheDocument();
  });
});
