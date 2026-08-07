import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductFilters, { ProductFilterForm } from './product-filters.component';

jest.mock('domains/app/components', () => ({
  __esModule: true,
  Filters: ({ selectors }: { selectors: Array<{ options: unknown[] }> }) => (
    <div data-testid="filters">{JSON.stringify(selectors)}</div>
  ),
}));

describe('<ProductFilters />', () => {
  it('includes Membership in registry-driven type filters', () => {
    const filterForm: ProductFilterForm = {
      search: '',
      statusFilter: 'all',
      typeFilter: 'all',
      priceFilter: 'all',
      sort: 'date-desc',
    };

    render(<ProductFilters filterForm={filterForm} setFilterForm={jest.fn()} />);

    expect(screen.getByTestId('filters')).toHaveTextContent('Memberships');
    expect(screen.getByTestId('filters')).toHaveTextContent('MEMBERSHIP');
  });
});
