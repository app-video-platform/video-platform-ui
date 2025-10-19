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
import { useNavigate } from 'react-router-dom';
import GalSearch from '../../../components/gal-search/gal-search.component';
import { fetchProducts } from '../../../api/services/products/products-api';
import './smart-search.styles.scss';
import { ProductMinimised } from '../../../api/models/product/product';

const SmartSearch: React.FC = () => {
  const [rawQuery, setRawQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the raw query into debouncedQuery
  const debouncedSetQuery = useMemo(
    () => debounce((q: string) => setDebouncedQuery(q), 250),
    [],
  );
  useEffect(() => () => debouncedSetQuery.cancel(), [debouncedSetQuery]);
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
  const [highlight, setHighlight] = useState(0);

  // Open dropdown when suggestions arrive
  useEffect(() => {
    if (suggestions.length > 0) {
      setOpen(true);
      setHighlight(0);
    } else {
      setOpen(false);
    }
  }, [suggestions]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlight((i) => (i + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlight((i) => (i - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter': {
        e.preventDefault();
        const pick = suggestions[highlight]?.title ?? rawQuery;
        navigate(`/app/explore/search?term=${encodeURIComponent(pick)}`);
        setOpen(false);
        break;
      }
    }
  };

  const handleSelect = (title: string) => {
    navigate(`/app/explore/search?term=${encodeURIComponent(title)}`);
    setOpen(false);
  };

  return (
    <div className="smart-search-container">
      <GalSearch
        value={rawQuery}
        onChange={setRawQuery}
        onSearch={(q) =>
          navigate(`/app/explore/search?term=${encodeURIComponent(q)}`)
        }
        onKeyDown={handleKeyDown}
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
      />

      {open && (
        <ul className="autocomplete-dropdown" role="listbox">
          {isFetching && <li className="autocomplete-message">Loading...</li>}
          {!isFetching && suggestions.length === 0 && (
            <li className="autocomplete-message">No suggestions</li>
          )}
          {suggestions.map((s, idx) => {
            const titleValue = s.title ?? '';
            const titleLower = titleValue.toLowerCase();
            const termLower = debouncedQuery.toLowerCase();
            const start = titleLower.indexOf(termLower);
            const end = start + termLower.length;
            return (
              <li
                key={s.id}
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
                  s.title
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SmartSearch;
