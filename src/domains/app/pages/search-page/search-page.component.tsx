import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchProducts, SearchResponse } from 'core/api/services';
import { GalProductCard } from 'domains/app/components';
import { ProductMinimised } from 'core/api/models';

import './search-page.styles.scss';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const term = searchParams.get('term') ?? '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const [page, setPage] = useState<number>(pageParam);
  const size = 20;

  // Fetch page of results
  const { data, isLoading, isError } = useQuery<
    SearchResponse<ProductMinimised>,
    Error
  >({
    queryKey: ['products-search', term, page],
    queryFn: () => fetchProducts({ term, page, size }),
  });

  // Sync page state to URL
  useEffect(() => {
    const params = new URLSearchParams({ term });
    if (page > 0) {
      params.set('page', String(page));
    }
    navigate({ search: params.toString() }, { replace: true });
  }, [term, page, navigate]);

  // Prefetch next page for smoother transitions
  useEffect(() => {
    if (
      data &&
      data.pageable &&
      data?.pageable?.pageNumber < data.totalPages - 1
    ) {
      fetchProducts({ term, page: page + 1, size });
    }
  }, [data, term, page]);

  if (isLoading) {
    return <div className="results-loading">Loading results...</div>;
  }
  if (isError) {
    return (
      <div className="results-error">Couldn&apos;t load results—try again.</div>
    );
  }

  return (
    <div className="search-page">
      <div className="results-container">
        <h1 className="results-title">Results for “{term}”</h1>

        {data?.content.length === 0 ? (
          <p className="results-empty">No products found for “{term}”.</p>
        ) : (
          <ul className="results-list">
            {data?.content.map((p: ProductMinimised) => (
              <GalProductCard key={p.id} product={p} />
            ))}
          </ul>
        )}

        <div className="results-pagination">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="pagination-button"
          >
            Prev
          </button>
          <span className="pagination-info">
            Page {data && data.number && data.number + 1} of{' '}
            {data && data.totalPages}
          </span>
          {data && (
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={data.number + 1 >= data.totalPages}
              className="pagination-button"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
