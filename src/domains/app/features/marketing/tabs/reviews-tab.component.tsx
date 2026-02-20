import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PageHeader } from 'domains/app/components';
import {
  getReviewsPage,
  ReviewsPageArgs,
  selectAllReviews,
} from 'core/store/reviews-store';
import { selectAuthUser } from 'core/store/auth-store';
import { AppDispatch } from 'core/api/models';
import ReviewsFilters, {
  ReviewFilterForm,
} from '../reviews/reviews-filters/reviews-filters.component';
import { ReviewCard } from '../reviews';

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

const ReviewsTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector(selectAllReviews);
  const user = useSelector(selectAuthUser);

  const [filterForm, setFilterForm] = useState<ReviewFilterForm>({
    search: '',
    status: 'all',
    rating: 'all',
    productId: '',
    sort: 'newest',
  });

  const debouncedFilters = useDebounce(filterForm, 400);

  useEffect(() => {
    if (!user) {
      return;
    }

    const { search, sort, status, rating, productId } = debouncedFilters;

    const payload: ReviewsPageArgs = {
      page: 0,
      filters: {
        productId,
        search,
        status,
        rating: rating !== 'all' ? rating : undefined,
        sort,
      },
    };

    dispatch(getReviewsPage(payload));
  }, [user, debouncedFilters]);
  return (
    <div className="reviews-tab">
      <PageHeader
        title="Reviews"
        subTitle="Read, reply, and manage your received product reviews"
      />

      <ReviewsFilters filterForm={filterForm} setFilterForm={setFilterForm} />
      <div className="reviews-tab-content">
        {reviews?.map((rev) => (
          <div key={rev.id} className="review-box">
            <ReviewCard review={rev} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;
