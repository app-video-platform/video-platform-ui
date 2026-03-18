/* eslint-disable indent */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectAuthUser } from 'core/store/auth-store';
import {
  getProductSummariesByOwner,
  selectProductSummaries,
  selectProductsLoading,
  selectProductsError,
} from 'core/store/product-store';
import { ProductCard } from 'domains/app/components';
import { Button } from '@shared/ui';
import { AppDispatch, ProductMinimised } from 'core/api/models';
import {
  ProductFilters,
  ProductFilterForm,
} from 'domains/app/features/product-form';

import './products-list.styles.scss';

const ProductsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const products = useSelector(selectProductSummaries);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    if (user && user.id) {
      dispatch(getProductSummariesByOwner(user.id));
    }
  }, [dispatch, user]);

  const [filterForm, setFilterForm] = useState<ProductFilterForm>({
    search: '',
    statusFilter: 'all',
    typeFilter: 'all',
    priceFilter: 'all',
    sort: 'date-desc',
  });

  const hasProducts = products && products.length > 0;
  const hasIssues = loading || error || !hasProducts;

  // 🔍 Filter logic (local, no extra requests)
  const filteredProducts = useMemo(() => {
    if (!products) {
      return [];
    }

    const {
      search,
      statusFilter,
      typeFilter,
      priceFilter,
      sort = 'date-desc',
    } = filterForm;

    const term = search?.trim().toLowerCase() ?? '';

    const filtered = products.filter((p) => {
      const matchesSearch =
        term === '' ||
        ((p.name ?? p.title) &&
          (p.name ?? p.title)?.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === 'all' || !p.status || p.status === statusFilter;

      const matchesType = typeFilter === 'all' || p.type === typeFilter;

      const isFree = p.price === 'free' || p.price === 0;
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'free' && isFree) ||
        (priceFilter === 'paid' && !isFree);

      return matchesSearch && matchesStatus && matchesType && matchesPrice;
    });

    const parseTimestamp = (value?: Date | string | null) => {
      if (!value) {
        return 0;
      }
      const timestamp =
        value instanceof Date ? value.getTime() : new Date(value).getTime();
      return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    const getCreatedTime = (product: ProductMinimised) =>
      parseTimestamp(product.createdAt);
    const getUpdatedTime = (product: ProductMinimised) =>
      parseTimestamp(product.updatedAt ?? product.createdAt);

    // 🔽 Sorting
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'date-asc':
          return getCreatedTime(a) - getCreatedTime(b);
        case 'date-desc':
          return getCreatedTime(b) - getCreatedTime(a);
        case 'updated-asc':
          return getUpdatedTime(a) - getUpdatedTime(b);
        case 'updated-desc':
          return getUpdatedTime(b) - getUpdatedTime(a);
        case 'name-asc':
          return (a.name ?? a.title ?? '').localeCompare(
            b.name ?? b.title ?? '',
          );
        case 'name-desc':
          return (b.name ?? b.title ?? '').localeCompare(
            a.name ?? a.title ?? '',
          );
        default:
          return 0;
      }
    });
  }, [products, filterForm]);

  const renderMessage = (): React.ReactNode => {
    if (loading) {
      return <p>Loading products...</p>;
    }
    if (error) {
      return <p className="error-message">Error: {error}</p>;
    }
    if (!hasProducts) {
      return <p>There are no products to show</p>;
    }
  };

  return (
    <div>
      <div className="products-header">
        <h1>My Products</h1>
        <Button
          className="add-product-btn"
          variant="primary"
          onClick={() => navigate('create')}
        >
          + Add product
        </Button>
      </div>
      <div className="divider" />

      <ProductFilters filterForm={filterForm} setFilterForm={setFilterForm} />
      {hasIssues ? (
        renderMessage()
      ) : (
        <div className="products-grid">
          {filteredProducts.map((prod) => (
            <ProductCard product={prod} key={prod.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
