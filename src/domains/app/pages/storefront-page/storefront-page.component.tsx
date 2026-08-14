import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AppDispatch, RootState } from 'core/api/models';
import {
  fetchPublicStorefront,
  selectPublicStorefrontByCreatorId,
  selectPublicStorefrontError,
  selectPublicStorefrontLoading,
} from 'core/store/storefront-store';
import {
  getStorefrontViewModelFromPublicStorefront,
  StorefrontPublicPage,
} from 'domains/app/features/storefront';

import './storefront-page.styles.scss';

const StorefrontPage: React.FC = () => {
  const { creatorId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const storefrontData = useSelector((state: RootState) =>
    selectPublicStorefrontByCreatorId(state, creatorId),
  );
  const loading = useSelector(selectPublicStorefrontLoading);
  const error = useSelector(selectPublicStorefrontError);

  useEffect(() => {
    if (creatorId) {
      dispatch(fetchPublicStorefront(creatorId));
    }
  }, [creatorId, dispatch]);

  const storefront = useMemo(
    () =>
      storefrontData
        ? getStorefrontViewModelFromPublicStorefront(storefrontData)
        : null,
    [storefrontData],
  );

  if (loading && !storefront) {
    return (
      <main className="storefront-route-state" aria-busy="true">
        <h1>Loading Storefront</h1>
        <p>Preparing this creator&apos;s public page.</p>
      </main>
    );
  }

  if (error || !storefront) {
    return (
      <main className="storefront-route-state" role="alert">
        <h1>Storefront unavailable</h1>
        <p>{error ?? 'Failed to load Storefront.'}</p>
      </main>
    );
  }

  return <StorefrontPublicPage storefront={storefront} />;
};

export default StorefrontPage;
