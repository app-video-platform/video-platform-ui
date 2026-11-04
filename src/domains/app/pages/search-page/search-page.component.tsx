import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchProducts, SearchResponse } from 'core/api/services';
import { ProductBox } from 'domains/app/components';
import { ProductMinimised } from 'core/api/models';

import './search-page.styles.scss';

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const term = searchParams.get('term') ?? '';
  const rawPage = searchParams.get('page');
  const parsedPage = rawPage === null ? 0 : Number(rawPage);
  const pageIsValid =
    rawPage === null ||
    (/^(0|[1-9]\d*)$/.test(rawPage) && Number.isSafeInteger(parsedPage));
  const page = pageIsValid && parsedPage >= 0 ? parsedPage : 0;
  const size = 20;

  // Fetch page of results
  const { data, isLoading, isError } = useQuery<
    SearchResponse<ProductMinimised>,
    Error
  >({
    queryKey: ['products-search', term, page, size],
    queryFn: () => fetchProducts({ term, page, size }),
  });
  const totalPages = data ? Math.max(1, data.totalPages || 0) : undefined;

  // The URL is the committed state. Normalize malformed/negative page values
  // with replace so history retains the user's actual navigation steps.
  useEffect(() => {
    if (!pageIsValid || parsedPage < 0) {
      setSearchParams((current) => {
        const params = new URLSearchParams();
        if (current.has('term')) {
          params.set('term', current.get('term') ?? '');
        }
        return params;
      }, { replace: true });
    }
  }, [pageIsValid, parsedPage, setSearchParams]);

  const goToPage = (nextPage: number) => {
    setSearchParams((current) => {
      const params = new URLSearchParams();
      if (current.has('term')) {
        params.set('term', current.get('term') ?? '');
      }
      if (nextPage > 0) {
        params.set('page', String(nextPage));
      }
      return params;
    });
  };

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
          <div className="results-empty">
            <p>
              {page > 0
                ? `No products found on page ${page + 1} for “${term}”.`
                : `No products found for “${term}”.`}
            </p>
            {page > 0 && (
              <button type="button" onClick={() => goToPage(0)}>
                Return to first page
              </button>
            )}
          </div>
        ) : (
          <ul className="results-list">
            {data?.content.map((p: ProductMinimised) => (
              <ProductBox key={p.id} product={p} />
            ))}
          </ul>
        )}

        <div className="results-pagination">
          <button
            onClick={() => goToPage(Math.max(page - 1, 0))}
            disabled={page === 0}
            className="pagination-button"
            aria-label="Previous results page"
          >
            Prev
          </button>
          <span className="pagination-info" aria-live="polite">
            {totalPages !== undefined && page < totalPages
              ? `Page ${page + 1} of ${totalPages}`
              : `Page ${page + 1}`}
          </span>
          {data && (
            <button
              onClick={() => goToPage(page + 1)}
              disabled={data.last || page + 1 >= (totalPages ?? 1)}
              className="pagination-button"
              aria-label="Next results page"
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
