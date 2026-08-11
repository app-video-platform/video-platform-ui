/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import CustomersList from './customers-list.component';
import CustomerDetail from './customer-detail.component';

describe('Creator Customers', () => {
  const originalUseMocks = process.env.REACT_APP_USE_MOCKS;

  const renderList = () =>
    render(
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
    render(
      <MemoryRouter initialEntries={[`/app/customers/${customerId}`]}>
        <Routes>
          <Route path="/app/customers" element={<CustomersList />} />
          <Route path="/app/customers/:customerId" element={<CustomerDetail />} />
        </Routes>
      </MemoryRouter>,
    );

  beforeEach(() => {
    process.env.REACT_APP_USE_MOCKS = 'true';
    window.localStorage.removeItem('creator-customers-empty');
  });

  afterEach(() => {
    process.env.REACT_APP_USE_MOCKS = originalUseMocks;
    window.localStorage.removeItem('creator-customers-empty');
  });

  it('renders the Customers route with inspection customers and result count', () => {
    renderList();

    expect(screen.getByRole('heading', { name: 'Customers' })).toBeInTheDocument();
    expect(screen.getByText('8 customers')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Open Maya Johnson customer profile' }),
    ).toBeInTheDocument();
  });

  it('searches by name or email and updates the result count', () => {
    renderList();

    fireEvent.change(screen.getByLabelText('Search by name or email'), {
      target: { value: 'mira' },
    });

    expect(screen.getByText('1 customer')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Open Mira Patel customer profile' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Open Maya Johnson customer profile' }),
    ).toBeNull();
  });

  it('filters by relationship status, product, and membership state', () => {
    renderList();

    fireEvent.change(screen.getByLabelText('Filter by relationship status'), {
      target: { value: 'past-due' },
    });
    fireEvent.change(screen.getByLabelText('Filter by product'), {
      target: { value: 'prod-membership-lab' },
    });
    fireEvent.change(screen.getByLabelText('Filter by membership state'), {
      target: { value: 'past_due' },
    });

    expect(screen.getByText('1 customer')).toBeInTheDocument();
    const miraRow = screen
      .getByRole('link', { name: 'Open Mira Patel customer profile' })
      .closest('article');
    expect(miraRow).not.toBeNull();
    expect(within(miraRow as HTMLElement).getByText('Past due')).toBeInTheDocument();
  });

  it('sorts customers by total spend', () => {
    renderList();

    fireEvent.change(screen.getByLabelText('Sort customers'), {
      target: { value: 'spend-asc' },
    });

    const customerLinks = screen.getAllByRole('link', {
      name: /open .* customer profile/i,
    });
    expect(customerLinks[0]).toHaveAccessibleName(
      'Open Elena Garcia customer profile',
    );
  });

  it('links customer identity to the dedicated Customer Detail route', () => {
    renderList();

    expect(
      screen.getByRole('link', { name: 'Open Maya Johnson customer profile' }),
    ).toHaveAttribute('href', '/app/customers/cust-maya-johnson');
  });

  it('renders distinct true-empty, search-empty, and filter-empty states', () => {
    window.localStorage.setItem('creator-customers-empty', 'true');
    let rendered = renderList();

    expect(screen.getByText('No customers yet')).toBeInTheDocument();
    expect(screen.queryByLabelText('Search by name or email')).toBeNull();
    rendered.unmount();

    window.localStorage.removeItem('creator-customers-empty');
    rendered = renderList();
    fireEvent.change(screen.getByLabelText('Search by name or email'), {
      target: { value: 'zara' },
    });
    expect(screen.getByText('No customers match "zara".')).toBeInTheDocument();
    rendered.unmount();

    renderList();
    fireEvent.change(screen.getByLabelText('Filter by relationship status'), {
      target: { value: 'waitlist' },
    });
    fireEvent.change(screen.getByLabelText('Filter by product'), {
      target: { value: 'prod-course-growth' },
    });
    expect(screen.getByText('No customers match these filters.')).toBeInTheDocument();
  });

  it('renders relationship status and total-spend formatting', () => {
    renderList();

    const mayaRow = screen
      .getByRole('link', { name: 'Open Maya Johnson customer profile' })
      .closest('article');

    expect(mayaRow).not.toBeNull();
    expect(within(mayaRow as HTMLElement).getByText('Active member')).toBeInTheDocument();
    expect(within(mayaRow as HTMLElement).getByText('€1,249')).toBeInTheDocument();
  });

  it('loads the correct customer detail header and tabs', () => {
    renderDetail('cust-maya-johnson');

    expect(screen.getByRole('heading', { name: 'Maya Johnson' })).toBeInTheDocument();
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

  it('renders Purchases, Access, and Notes tab states', () => {
    renderDetail('cust-maya-johnson');

    fireEvent.click(screen.getByRole('tab', { name: 'Purchases' }));
    expect(screen.getByRole('heading', { name: 'Purchases' })).toBeInTheDocument();
    expect(screen.getAllByText('Paid')[0]).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Access' }));
    expect(screen.getByRole('heading', { name: 'Access' })).toBeInTheDocument();
    expect(screen.getByText('Manual grant')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Notes' }));
    expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument();
    expect(
      screen.getByText(/Prefers launch planning examples/i),
    ).toBeInTheDocument();
  });

  it('renders honest production unavailable states when inspection mocks are off', () => {
    process.env.REACT_APP_USE_MOCKS = 'false';
    const { unmount } = renderList();

    expect(screen.getByText('Customer data is not available yet')).toBeInTheDocument();
    expect(screen.queryByText('Maya Johnson')).toBeNull();
    unmount();

    renderDetail('cust-maya-johnson');
    expect(
      screen.getByText('Customer profile data is not available yet'),
    ).toBeInTheDocument();
  });
});
