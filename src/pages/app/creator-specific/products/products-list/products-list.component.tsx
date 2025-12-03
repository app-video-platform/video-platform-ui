/* eslint-disable indent */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { CiCircleRemove } from 'react-icons/ci';
import { BiSort } from 'react-icons/bi';
import { IoIosPricetags } from 'react-icons/io';
import { MdOutlineTypeSpecimen } from 'react-icons/md';
import { SiStatuspal } from 'react-icons/si';

import { selectAuthUser } from '@store/auth-store';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
  getAllProductsByUserId,
} from '@store/product-store';
import { AppDispatch } from '@store/store';
import { ProductCard } from '@components';
import { Button, Input, Select, SelectOption } from '@shared/ui';
import { AbstractProduct, ProductStatus, ProductType } from '@api/types';

import './products-list.styles.scss';

type StatusFilter = 'all' | ProductStatus;
type TypeFilter = 'all' | ProductType;
type PriceFilter = 'all' | 'free' | 'paid';
type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

interface FilterForm {
  searchTerm: string;
  statusFilter: StatusFilter;
  typeFilter: TypeFilter;
  priceFilter: PriceFilter;
  sortBy: SortOption;
}

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

  const [filterForm, setFilterForm] = useState<FilterForm>({
    searchTerm: '',
    statusFilter: 'all',
    typeFilter: 'all',
    priceFilter: 'all',
    sortBy: 'date-desc',
  });

  const hasProducts = products && products.length > 0;
  const hasIssues = loading || error || !hasProducts;

  // 🔍 Filter logic (local, no extra requests)
  const filteredProducts = useMemo(() => {
    if (!products) {
      return [];
    }

    const {
      searchTerm,
      statusFilter,
      typeFilter,
      priceFilter,
      sortBy = 'date-desc',
    } = filterForm;

    const term = searchTerm?.trim().toLowerCase() ?? '';

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
      switch (sortBy) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilterForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearchReset = () =>
    setFilterForm((prevData) => ({ ...prevData, searchTerm: '' }));

  const STATUS_OPTIONS: SelectOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Hidden', value: 'HIDDEN' },
  ];

  const TYPE_OPTIONS: SelectOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Courses', value: 'COURSE' },
    { label: 'Download Packages', value: 'DOWNLOAD' },
    { label: 'Consultation Sessions', value: 'CONSULTATION' },
  ];

  const PRICE_OPTIONS: SelectOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Free', value: 'free' },
    { label: 'Paid', value: 'paid' },
  ];

  const SORT_OPTIONS: SelectOption[] = [
    { label: 'Newest first', value: 'date-desc' },
    { label: 'Oldest first', value: 'date-asc' },
    { label: 'Name A → Z', value: 'name-asc' },
    { label: 'Name Z → A', value: 'name-desc' },
  ];

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

      <div className="products-filter-row">
        <div className="filters">
          <Input
            value={filterForm.searchTerm ?? ''}
            prefixIcon={FaSearch}
            suffixIcon={CiCircleRemove}
            handleSuffixClick={handleSearchReset}
            onChange={handleChange}
            placeholder="Search your products..."
            name="searchTerm"
            className="search-input"
          />
          <Select
            name="statusFilter"
            value={filterForm.statusFilter}
            options={STATUS_OPTIONS}
            onChange={handleChange}
            customClassName="status-select"
            prefixIcon={SiStatuspal}
          />
          <Select
            name="typeFilter"
            value={filterForm.typeFilter}
            options={TYPE_OPTIONS}
            onChange={handleChange}
            customClassName="status-select"
            prefixIcon={MdOutlineTypeSpecimen}
          />
          <Select
            name="priceFilter"
            value={filterForm.priceFilter}
            options={PRICE_OPTIONS}
            onChange={handleChange}
            customClassName="status-select"
            prefixIcon={IoIosPricetags}
          />
        </div>

        <Select
          name="sortBy"
          value={filterForm.sortBy}
          options={SORT_OPTIONS}
          onChange={handleChange}
          customClassName="sort-select"
          prefixIcon={BiSort}
        />
      </div>
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
