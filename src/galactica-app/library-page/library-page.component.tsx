import React from 'react';

import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';

import './library-page.styles.scss';

const LibraryPage: React.FC = () => {
  const user = useSelector(selectAuthUser);

  return (
    <div className="library-page">
      <h1>My Library</h1>
      <h2>Started courses</h2>
      <h2>Completed courses</h2>
      <h2>Wishlist</h2>
    </div>
  );
};

export default LibraryPage;
