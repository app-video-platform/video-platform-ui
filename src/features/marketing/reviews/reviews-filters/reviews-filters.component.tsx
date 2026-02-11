import React from 'react';
import { TbStars } from 'react-icons/tb';
import { AiOutlineProduct } from 'react-icons/ai';
import { MdOutlineVisibility } from 'react-icons/md';

import { SelectOption } from '@shared/ui';
import { Filters, FilterSelector } from '@components';

export type StatusFilter = 'all' | 'visible' | 'hidden';
export type RatingFilter = 'all' | 1 | 2 | 3 | 4 | 5;
export type SortOption = 'newest' | 'oldest' | 'rating-high' | 'rating-low';

export interface ReviewFilterForm {
  productId: string;
  rating: RatingFilter;
  status: StatusFilter;
  search: string;
  sort: SortOption;
}

interface ReviewsFiltersProps {
  filterForm: ReviewFilterForm;
  setFilterForm: React.Dispatch<React.SetStateAction<ReviewFilterForm>>;
}

const ReviewsFilters: React.FC<ReviewsFiltersProps> = ({
  filterForm,
  setFilterForm,
}) => {
  const STATUS_OPTIONS: SelectOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Visible', value: 'visible' },
    { label: 'Hidden', value: 'hidden' },
  ];

  const RATING_OPTIONS: SelectOption[] = [
    { label: 'All', value: 'all' },
    { label: '1 Star', value: 1 },
    { label: '2 Stars', value: 2 },
    { label: '3 Stars', value: 3 },
    { label: '4 Stars', value: 4 },
    { label: '5 Stars', value: 5 },
  ];

  const SORT_OPTIONS: SelectOption[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Rating High', value: 'rating-high' },
    { label: 'Rating Low', value: 'rating-low' },
  ];

  const filterSelectors: FilterSelector[] = [
    {
      name: 'productId',
      value: filterForm.productId,
      options: [],
      icon: AiOutlineProduct,
    },
    {
      name: 'status',
      value: filterForm.status,
      options: STATUS_OPTIONS,
      icon: MdOutlineVisibility,
    },
    {
      name: 'rating',
      value: filterForm.rating,
      options: RATING_OPTIONS,
      icon: TbStars,
    },
  ];

  return (
    <Filters<ReviewFilterForm>
      showSearch
      search={filterForm.search}
      setFilterForm={setFilterForm}
      selectors={filterSelectors}
      searchPlaceholder="Search through your product reviews"
      sortOptions={SORT_OPTIONS}
      sortValue={filterForm.sort}
    />
  );
};

export default ReviewsFilters;
