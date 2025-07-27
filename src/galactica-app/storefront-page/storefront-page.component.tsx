import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectAuthUser } from '../../store/auth-store/auth.selectors';

import './storefront-page.styles.scss';

const StorefrontPage: React.FC = () => {
  const { creatorId } = useParams();
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    console.log('creator id', creatorId);
  }, [creatorId]);

  return <div></div>;
};

export default StorefrontPage;
