import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';
import { MdOutlineTypeSpecimen } from 'react-icons/md';
import { SiStatuspal } from 'react-icons/si';

import { selectAuthUser } from 'core/store/auth-store';
import {
  getProductSummariesByOwner,
  selectProductSummaries,
  selectProductsLoading,
  selectProductsError,
} from 'core/store/product-store';
import { PRODUCT_FILTER_OPTIONS } from 'core/constants';
import { Button, Input, Select, SelectOption } from '@shared/ui';
import { AppDispatch } from 'core/api/models';

import ProductManagementRow from './product-management-row.component';
import {
  defaultProductsFilterForm,
  filterAndSortProducts,
  ProductsFilterForm,
} from './products-list.utils';

import './products-list.styles.scss';

const ProductsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const products = useSelector(selectProductSummaries);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const user = useSelector(selectAuthUser);
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(getProductSummariesByOwner(userId));
    }
  }, [dispatch, userId]);

  const [filterForm, setFilterForm] = useState<ProductsFilterForm>(
    defaultProductsFilterForm,
  );

  const hasProducts = Boolean(products && products.length > 0);
  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filterForm),
    [products, filterForm],
  );

  const hasSearch = filterForm.search.trim().length > 0;
  const hasFilters =
    filterForm.statusFilter !== 'all' || filterForm.typeFilter !== 'all';
  const hasActiveRefinement = hasSearch || hasFilters;
  const resultCountLabel = `${filteredProducts.length} ${
    filteredProducts.length === 1 ? 'product' : 'products'
  }`;

  const handleControlChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFilterForm((current) => ({ ...current, [name]: value }));
  };

  const clearSearch = () =>
    setFilterForm((current) => ({ ...current, search: '' }));

  const clearFilters = () => setFilterForm(defaultProductsFilterForm);

  const TYPE_OPTIONS: SelectOption[] = [
    { label: 'All types', value: 'all' },
    ...PRODUCT_FILTER_OPTIONS.map((option) => ({
      label: option.label,
      value: option.type,
    })),
  ];

  const STATUS_OPTIONS: SelectOption[] = [
    { label: 'All statuses', value: 'all' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Draft', value: 'DRAFT' },
  ];

  const SORT_OPTIONS: SelectOption[] = [
    { label: 'Recently updated', value: 'updated-desc' },
    { label: 'Newest', value: 'created-desc' },
    { label: 'Oldest', value: 'created-asc' },
    { label: 'Name A-Z', value: 'name-asc' },
    { label: 'Name Z-A', value: 'name-desc' },
  ];

  const renderState = (): React.ReactNode => {
    if (loading) {
      return (
        <div className="products-state products-state--loading" aria-live="polite">
          <div className="products-skeleton-row" />
          <div className="products-skeleton-row" />
          <div className="products-skeleton-row" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="products-state" role="alert">
          <h2>Products could not load</h2>
          <p>{error}</p>
          {userId && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => dispatch(getProductSummariesByOwner(userId))}
            >
              Retry
            </Button>
          )}
        </div>
      );
    }

    if (!hasProducts) {
      return (
        <div className="products-state">
          <h2>Create your first product</h2>
          <p>Start with a course, download, consultation, or membership.</p>
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('create')}
          >
            + Add product
          </Button>
        </div>
      );
    }

    if (filteredProducts.length === 0 && hasSearch) {
      return (
        <div className="products-state">
          <h2>{`No products match "${filterForm.search.trim()}".`}</h2>
          <p>Try another search.</p>
          <Button type="button" variant="secondary" onClick={clearSearch}>
            Clear search
          </Button>
        </div>
      );
    }

    if (filteredProducts.length === 0 && hasFilters) {
      return (
        <div className="products-state">
          <h2>No products match these filters.</h2>
          <p>Try a different type or status.</p>
          <Button type="button" variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>Create and manage everything you sell.</p>
        </div>
        <Button
          className="add-product-btn"
          variant="primary"
          onClick={() => navigate('create')}
        >
          + Add product
        </Button>
      </div>

      {hasProducts && (
        <section className="products-toolbar" aria-label="Product controls">
          <Input
            value={filterForm.search}
            prefixIcon={FaSearch}
            onChange={handleControlChange}
            placeholder="Search products..."
            name="search"
            aria-label="Search products"
            className="products-toolbar__search"
          />
          <div className="products-toolbar__filters">
            <Select
              name="typeFilter"
              value={filterForm.typeFilter}
              options={TYPE_OPTIONS}
              onChange={handleControlChange}
              customClassName="products-toolbar__select"
              prefixIcon={MdOutlineTypeSpecimen}
              aria-label="Filter by product type"
            />
            <Select
              name="statusFilter"
              value={filterForm.statusFilter}
              options={STATUS_OPTIONS}
              onChange={handleControlChange}
              customClassName="products-toolbar__select"
              prefixIcon={SiStatuspal}
              aria-label="Filter by product status"
            />
            <Select
              name="sort"
              value={filterForm.sort}
              options={SORT_OPTIONS}
              onChange={handleControlChange}
              customClassName="products-toolbar__select products-toolbar__sort"
              prefixIcon={BiSort}
              aria-label="Sort products"
            />
          </div>
        </section>
      )}

      {hasProducts && (
        <div className="products-collection-meta">
          <span>{resultCountLabel}</span>
          {hasActiveRefinement && (
            <Button type="button" variant="tertiary" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {renderState() || (
        <section className="products-management-list" aria-label="Products">
          <div className="products-management-list__header" aria-hidden="true">
            <span>Product</span>
            <span>Status</span>
            <span>Price</span>
            <span>Updated</span>
            <span>Actions</span>
          </div>
          <div className="products-management-list__rows">
            {filteredProducts.map((product) => (
              <ProductManagementRow
                product={product}
                key={product.id}
                showInspectionRecurringMembership={
                  process.env.REACT_APP_USE_MOCKS === 'true'
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductsList;
