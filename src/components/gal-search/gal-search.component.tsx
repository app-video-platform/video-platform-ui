import React, { useState, FormEvent } from 'react';
import { CiSearch } from 'react-icons/ci';

import GalIcon from '../gal-icon-component/gal-icon.component';

import './gal-search.styles.scss';

type GalSearchProps = {
  placeholder?: string;
  // eslint-disable-next-line no-unused-vars
  onSearch: (query: string) => void;
};

const GalSearch: React.FC<GalSearchProps> = ({
  placeholder = 'Search...',
  onSearch,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      <button type="submit" className="search-button">
        <GalIcon icon={CiSearch} size={24} />
      </button>
    </form>
  );
};

export default GalSearch;
