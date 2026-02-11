import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { CiCircleRemove } from 'react-icons/ci';
import { IconType } from 'react-icons';
import { BiSort } from 'react-icons/bi';

import { Input, Select, SelectOption } from '@shared/ui';

import './filters.styles.scss';

export interface FilterSelector {
  name: string;
  value: string | number;
  options: SelectOption[];
  icon?: IconType;
}

interface FiltersProps<T> {
  showSearch?: boolean;
  search?: string;
  searchPlaceholder?: string;
  setFilterForm: React.Dispatch<React.SetStateAction<T>>;
  selectors: FilterSelector[];
  sortOptions?: SelectOption[];
  sortValue?: string;
}

const Filters = <T,>({
  showSearch,
  search,
  searchPlaceholder,
  selectors,
  sortOptions,
  sortValue,
  setFilterForm,
}: FiltersProps<T>) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilterForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearchReset = () =>
    setFilterForm((prevData) => ({ ...prevData, search: '' }));

  return (
    <div className="filter-row">
      <div className="filters">
        {showSearch && (
          <Input
            value={search ?? ''}
            prefixIcon={FaSearch}
            suffixIcon={CiCircleRemove}
            handleSuffixClick={handleSearchReset}
            onChange={handleChange}
            placeholder={searchPlaceholder}
            name="search"
            className="search-input"
          />
        )}

        {selectors.map((selector, index) => (
          <Select
            key={index}
            name={selector.name}
            value={selector.value}
            options={selector.options}
            onChange={handleChange}
            customClassName="status-select"
            prefixIcon={selector.icon}
          />
        ))}
      </div>

      {sortOptions && (
        <Select
          name="sort"
          value={sortValue ?? ''}
          options={sortOptions}
          onChange={handleChange}
          customClassName="sort-select"
          prefixIcon={BiSort}
        />
      )}
    </div>
  );
};

export default Filters;
