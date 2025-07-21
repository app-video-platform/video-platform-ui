import React, { useState, FormEvent } from 'react';
import { CiSearch } from 'react-icons/ci';

import './search.styles.scss';
import IconComponent from '../icon-component/gal-icon.component';

type SearchProps = {
  placeholder?: string;
  // eslint-disable-next-line no-unused-vars
  onSearch: (query: string) => void;
};

const Search: React.FC<SearchProps> = ({
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
        <IconComponent icon={CiSearch} size={24} />
      </button>
    </form>
  );
};

export default Search;
