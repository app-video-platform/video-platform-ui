/* eslint-disable indent */
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  KeyboardEvent,
} from 'react';
import debounce from 'lodash.debounce';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { Search } from 'domains/app/components';
import { fetchProducts } from 'core/api/services';
import { ProductMinimised } from 'core/api/models';
import { appRoutes } from 'domains/app/routes/routes';

import './smart-search.styles.scss';

const SmartSearch: React.FC = () => {
  const [rawQuery, setRawQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the raw query into debouncedQuery
  const debouncedSetQuery = useMemo(
    () => debounce((q: string) => setDebouncedQuery(q), 250),
    [],
  );
  useEffect(() => () => debouncedSetQuery.cancel(), [debouncedSetQuery]);
  useEffect(() => {
    if (location.pathname === appRoutes.exploreSearch) {
      setRawQuery(new URLSearchParams(location.search).get('term') ?? '');
    }
  }, [location.pathname, location.search]);
  useEffect(() => {
    const trimmed = rawQuery.trim();
    if (trimmed.length >= 2) {
      debouncedSetQuery(trimmed);
    } else {
      debouncedSetQuery.cancel();
      setDebouncedQuery('');
    }
  }, [rawQuery, debouncedSetQuery]);

  // Fetch suggestions only; simple two-arg useQuery
  const { data: suggestions = [], isFetching } = useQuery<
    ProductMinimised[],
    Error
  >({
    queryKey: ['products-autocomplete', debouncedQuery],
    queryFn: () => {
      if (debouncedQuery.length < 2) {
        return Promise.resolve([]);
      }
      return fetchProducts({ term: debouncedQuery, page: 0, size: 10 }).then(
        (r) => r.content,
      );
    },
    enabled: debouncedQuery.length >= 2,
  });

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const trimmedQuery = rawQuery.trim();
  const suggestionsMatchQuery =
    trimmedQuery.length >= 2 && trimmedQuery === debouncedQuery;
  const visibleSuggestions = suggestionsMatchQuery ? suggestions : [];
  const listboxId = 'product-search-suggestions';

  const submitSearch = (query: string) => {
    const params = new URLSearchParams();
    params.set('term', query.trim());
    navigate(`${appRoutes.exploreSearch}?${params.toString()}`);
    setOpen(false);
    setHighlight(-1);
  };

  // Open dropdown when suggestions arrive
  useEffect(() => {
    if (suggestionsMatchQuery && suggestions.length > 0) {
      setOpen(true);
      setHighlight(-1);
    } else {
      setOpen(false);
    }
  }, [suggestions, suggestionsMatchQuery]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setHighlight(-1);
      return;
    }
    if (!open || !suggestionsMatchQuery || visibleSuggestions.length === 0) {
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlight((i) => (i + 1 + visibleSuggestions.length) % visibleSuggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlight((i) => (i <= 0 ? visibleSuggestions.length - 1 : i - 1));
        break;
      case 'Enter': {
        e.preventDefault();
        const selected = highlight >= 0 ? visibleSuggestions[highlight] : undefined;
        submitSearch(selected?.title ?? rawQuery);
        break;
      }
    }
  };

  const handleSelect = (title: string) => {
    if (suggestionsMatchQuery) {
      submitSearch(title);
    }
  };

  return (
    <div className="smart-search-container">
      <Search
        value={rawQuery}
        onChange={(query) => {
          setRawQuery(query);
          setHighlight(-1);
          setOpen(false);
        }}
        onSearch={submitSearch}
        onKeyDown={handleKeyDown}
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
        combobox={{
          controls: listboxId,
          expanded: open && visibleSuggestions.length > 0,
          activeDescendant:
            highlight >= 0 ? `product-search-option-${highlight}` : undefined,
        }}
      />

      <ul
        className="autocomplete-dropdown"
        id={listboxId}
        role="listbox"
        hidden={!open || !suggestionsMatchQuery}
      >
          {isFetching && <li className="autocomplete-message">Loading...</li>}
          {!isFetching && visibleSuggestions.length === 0 && (
            <li className="autocomplete-message">No suggestions</li>
          )}
          {visibleSuggestions.map((s, idx) => {
            const titleValue = s.title ?? '';
            const titleLower = titleValue.toLowerCase();
            const termLower = debouncedQuery.toLowerCase();
            const start = titleLower.indexOf(termLower);
            const end = start + termLower.length;
            return (
              <li
                key={s.id}
                id={`product-search-option-${idx}`}
                role="option"
                aria-selected={idx === highlight}
                className={
                  'autocomplete-item' +
                  (idx === highlight ? ' highlighted' : '')
                }
                onMouseDown={() => handleSelect(titleValue)}
              >
                {start >= 0 ? (
                  <>
                    {titleValue.slice(0, start)}
                    <strong>{titleValue.slice(start, end)}</strong>
                    {titleValue.slice(end)}
                  </>
                ) : (
                  titleValue
                )}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default SmartSearch;
