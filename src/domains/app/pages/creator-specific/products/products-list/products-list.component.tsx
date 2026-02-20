/* eslint-disable indent */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectAuthUser } from 'core/store/auth-store';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
  getAllProductsByUserId,
} from 'core/store/product-store';
import { ProductCard } from 'domains/app/components';
import { Button } from '@shared/ui';
import { AbstractProduct, AppDispatch } from 'core/api/models';
import {
  ProductFilters,
  ProductFilterForm,
} from 'domains/app/features/product-form';

import './products-list.styles.scss';

const ProductsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    if (user && user.id) {
      dispatch(getAllProductsByUserId(user.id));
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
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term));

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      const matchesType = typeFilter === 'all' || p.type === typeFilter;

      const isFree = p.price === 'free' || p.price === 0;
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'free' && isFree) ||
        (priceFilter === 'paid' && !isFree);

      return matchesSearch && matchesStatus && matchesType && matchesPrice;
    });

    // 🔽 Sorting
    const getTime = (product: AbstractProduct) => {
      // adjust this field name to whatever you actually have: createdAt / updatedAt / publishedAt, etc.
      const value = product.createdAt;
      return value ? new Date(value).getTime() : 0;
    };

    return filtered.sort((a, b) => {
      switch (sort) {
        case 'date-asc':
          return getTime(a) - getTime(b);
        case 'date-desc':
          return getTime(b) - getTime(a);
        case 'name-asc':
          return (a.name ?? '').localeCompare(b.name ?? '');
        case 'name-desc':
          return (b.name ?? '').localeCompare(a.name ?? '');
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
