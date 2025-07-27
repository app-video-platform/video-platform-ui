import React, { useEffect } from 'react';

import './storefront-page.styles.scss';
import { useParams } from 'react-router-dom';

const StorefrontPage: React.FC = () => {
  const { creatorId } = useParams();

  useEffect(() => {
    console.log('creator id', creatorId);
  }, [creatorId]);

  return <div></div>;
};

export default StorefrontPage;
