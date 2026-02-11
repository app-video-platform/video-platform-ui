import React from 'react';
import { SiStatuspal } from 'react-icons/si';
import { MdOutlineTypeSpecimen } from 'react-icons/md';
import { IoIosPricetags } from 'react-icons/io';

import { ProductStatus, ProductType } from '@api/models';
import { Filters, FilterSelector } from '@components';
import { SelectOption } from '@shared/ui';

type StatusFilter = 'all' | ProductStatus;
type TypeFilter = 'all' | ProductType;
type PriceFilter = 'all' | 'free' | 'paid';
type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

export interface ProductFilterForm {
  search: string;
  statusFilter: StatusFilter;
  typeFilter: TypeFilter;
  priceFilter: PriceFilter;
  sort: SortOption;
}

interface ProductFiltersProps {
  filterForm: ProductFilterForm;
  setFilterForm: React.Dispatch<React.SetStateAction<ProductFilterForm>>;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filterForm,
  setFilterForm,
}) => {
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

  const filterSelectors: FilterSelector[] = [
    {
      name: 'statusFilter',
      value: filterForm.statusFilter,
      options: STATUS_OPTIONS,
      icon: SiStatuspal,
    },
    {
      name: 'typeFilter',
      value: filterForm.typeFilter,
      options: TYPE_OPTIONS,
      icon: MdOutlineTypeSpecimen,
    },
    {
      name: 'priceFilter',
      value: filterForm.priceFilter,
      options: PRICE_OPTIONS,
      icon: IoIosPricetags,
    },
  ];

  return (
    <Filters<ProductFilterForm>
      showSearch
      search={filterForm.search}
      setFilterForm={setFilterForm}
      selectors={filterSelectors}
      searchPlaceholder="Search your products..."
      sortOptions={SORT_OPTIONS}
      sortValue={filterForm.sort}
    />
  );
};

export default ProductFilters;
