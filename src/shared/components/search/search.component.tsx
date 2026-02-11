import React, { FormEvent } from 'react';
import { CiSearch } from 'react-icons/ci';

import { VPIcon } from '@shared/ui';
import { getCssVar } from '@shared/utils';

import './search.styles.scss';

type GalSearchProps = {
  /** The current input value */
  value: string;
  /** Called on every keystroke (or change) */
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  /** Called when the user explicitly submits (Enter or click) */
  // eslint-disable-next-line no-unused-vars
  onSearch: (value: string) => void;
  /** Optional Enter/Arrow handlers for parent to intercept */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  /** Allows parent to manage focus */
  inputRef?: React.RefObject<HTMLInputElement>;
  /** Placeholder text */
  placeholder?: string;
  /** Extra className for styling */
  customClassName?: string;
};

const Search: React.FC<GalSearchProps> = ({
  value,
  onChange,
  onSearch,
  onKeyDown,
  inputRef,
  placeholder = 'Search...',
  customClassName = '',
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim().length >= 2) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`search-form ${customClassName}`}>
      <input
        ref={inputRef}
        type="text"
        name="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="search-input"
        aria-label="Product search"
      />
      <button
        type="submit"
        className="search-button"
        aria-label="Submit search"
      >
        <VPIcon icon={CiSearch} size={24} color={getCssVar('--text-primary')} />
      </button>
    </form>
  );
};

export default Search;
