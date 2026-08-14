import React, { useEffect, useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';
import { MdGroups, MdOutlineInventory2, MdOutlinePayments } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { Input, Select, SelectOption, Button } from '@shared/ui';
import { AppDispatch } from 'core/api/models';
import {
  fetchCreatorCustomersPage,
  selectCreatorCustomerProductOptions,
  selectCreatorCustomers,
  selectCreatorCustomersListError,
  selectCreatorCustomersListLoading,
  selectCreatorCustomersPage,
} from 'core/store/customers-store';

import CustomerManagementRow from './customer-management-row.component';
import {
  CustomerFilterForm,
  defaultCustomerFilterForm,
} from './creator-customers.utils';

import './customers.styles.scss';

const PAGE_SIZE = 6;

const statusOptions: SelectOption[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active member', value: 'active-member' },
  { label: 'Past due', value: 'past-due' },
  { label: 'Buyer', value: 'buyer' },
  { label: 'Waitlist', value: 'waitlist' },
];

const membershipOptions: SelectOption[] = [
  { label: 'All membership', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Past due', value: 'past_due' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'No membership', value: 'none' },
];

const sortOptions: SelectOption[] = [
  { label: 'Recent activity', value: 'last-activity-desc' },
  { label: 'Highest spend', value: 'spend-desc' },
  { label: 'Lowest spend', value: 'spend-asc' },
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' },
];

const CustomersList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customersPage = useSelector(selectCreatorCustomersPage);
  const customers = useSelector(selectCreatorCustomers);
  const productFilterOptions = useSelector(selectCreatorCustomerProductOptions);
  const loading = useSelector(selectCreatorCustomersListLoading);
  const error = useSelector(selectCreatorCustomersListError);
  const [filterForm, setFilterForm] = useState<CustomerFilterForm>(
    defaultCustomerFilterForm,
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(
      fetchCreatorCustomersPage({
        page,
        pageSize: PAGE_SIZE,
        search: filterForm.search,
        status: filterForm.status,
        product: filterForm.product,
        membership: filterForm.membership,
        sort: filterForm.sort,
      }),
    );
  }, [dispatch, filterForm, page]);

  const productOptions = useMemo(
    () => [
      { label: 'All products', value: 'all' },
      ...productFilterOptions.map((product) => ({
        label: product.name,
        value: product.id,
      })),
    ],
    [productFilterOptions],
  );
  const hasSearch = filterForm.search.trim().length > 0;
  const hasFilters =
    filterForm.status !== 'all' ||
    filterForm.product !== 'all' ||
    filterForm.membership !== 'all';
  const hasActiveRefinement = hasSearch || hasFilters;
  const totalPages = customersPage?.totalPages ?? 1;
  const currentPage = customersPage?.number ?? page;
  const totalElements = customersPage?.totalElements ?? 0;
  const hasCustomers = totalElements > 0;
  const hasControls =
    productFilterOptions.length > 0 || customers.length > 0 || hasActiveRefinement;
  const clearRefinementLabel = hasSearch && !hasFilters ? 'Clear search' : 'Clear filters';
  const resultCountLabel = `${totalElements} ${
    totalElements === 1 ? 'customer' : 'customers'
  }`;

  const handleControlChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setPage(0);
    setFilterForm((current) => ({ ...current, [name]: value }));
  };

  const clearSearch = () => {
    setPage(0);
    setFilterForm((current) => ({ ...current, search: '' }));
  };

  const clearFilters = () => {
    setPage(0);
    setFilterForm(defaultCustomerFilterForm);
  };

  const clearActiveRefinement = () => {
    if (hasSearch && !hasFilters) {
      clearSearch();
      return;
    }

    clearFilters();
  };

  const renderState = (): React.ReactNode => {
    if (loading && !customersPage) {
      return (
        <div className="customers-state" role="status">
          <h2>Loading customers</h2>
        </div>
      );
    }

    if (error) {
      return (
        <div className="customers-state" role="status">
          <h2>Customer data is not available yet</h2>
          <p>
            Customers will appear here once customer, purchase, membership, and
            waitlist APIs are connected.
          </p>
        </div>
      );
    }

    if (!hasCustomers && !hasActiveRefinement) {
      return (
        <div className="customers-state">
          <h2>No customers yet</h2>
          <p>
            Customers will appear here after purchases, memberships, or waitlist
            sign-ups.
          </p>
        </div>
      );
    }

    if (totalElements === 0 && hasSearch) {
      return (
        <div className="customers-state">
          <h2>{`No customers match "${filterForm.search.trim()}".`}</h2>
          <p>Try another name or email.</p>
          <Button type="button" variant="secondary" onClick={clearSearch}>
            Clear search
          </Button>
        </div>
      );
    }

    if (totalElements === 0 && hasFilters) {
      return (
        <div className="customers-state">
          <h2>No customers match these filters.</h2>
          <p>Try a different status, product, or membership state.</p>
          <Button type="button" variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="customers-page">
      <header className="customers-header">
        <div>
          <h1>Customers</h1>
          <p>Understand your customers and their relationships.</p>
        </div>
      </header>

      {hasControls && (
        <section className="customers-toolbar" aria-label="Customer controls">
          <Input
            value={filterForm.search}
            prefixIcon={FaSearch}
            onChange={handleControlChange}
            placeholder="Search by name or email..."
            name="search"
            aria-label="Search by name or email"
            className="customers-toolbar__search"
          />
          <div className="customers-toolbar__filters">
            <Select
              name="status"
              value={filterForm.status}
              options={statusOptions}
              onChange={handleControlChange}
              customClassName="customers-toolbar__select"
              prefixIcon={MdGroups}
              aria-label="Filter by relationship status"
            />
            <Select
              name="product"
              value={filterForm.product}
              options={productOptions}
              onChange={handleControlChange}
              customClassName="customers-toolbar__select"
              prefixIcon={MdOutlineInventory2}
              aria-label="Filter by product"
            />
            <Select
              name="membership"
              value={filterForm.membership}
              options={membershipOptions}
              onChange={handleControlChange}
              customClassName="customers-toolbar__select"
              prefixIcon={MdOutlinePayments}
              aria-label="Filter by membership state"
            />
            <Select
              name="sort"
              value={filterForm.sort}
              options={sortOptions}
              onChange={handleControlChange}
              customClassName="customers-toolbar__select customers-toolbar__sort"
              prefixIcon={BiSort}
              aria-label="Sort customers"
            />
          </div>
        </section>
      )}

      {hasControls && (
        <div className="customers-collection-meta">
          <span>{resultCountLabel}</span>
          {hasActiveRefinement && (
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={clearActiveRefinement}
            >
              {clearRefinementLabel}
            </Button>
          )}
        </div>
      )}

      {renderState() || (
        <>
          <section className="customers-management-list" aria-label="Customers">
            <div className="customers-management-list__header" aria-hidden="true">
              <span>Customer</span>
              <span>Status</span>
              <span>Products</span>
              <span>Total spend</span>
              <span>Last activity</span>
            </div>
            <div className="customers-management-list__rows">
              {customers.map((customer) => (
                <CustomerManagementRow customer={customer} key={customer.id} />
              ))}
            </div>
          </section>

          {totalPages > 1 && (
            <nav className="customers-pagination" aria-label="Customer pages">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => setPage((value) => Math.max(0, value - 1))}
              >
                Previous
              </Button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() =>
                  setPage((value) => Math.min(totalPages - 1, value + 1))
                }
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default CustomersList;
