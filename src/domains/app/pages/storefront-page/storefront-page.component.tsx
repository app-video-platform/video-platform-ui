import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ProductMinimised } from 'core/api/models';
import { getAllProductsMinimalByUserAPI } from 'core/api/services';
import {
  getProfileFromProducts,
  getStorefrontViewModel,
  StorefrontPublicPage,
  storefrontInspectionFeaturedProductId,
  storefrontInspectionProducts,
  storefrontInspectionUser,
} from 'domains/app/features/storefront';

import './storefront-page.styles.scss';

const StorefrontPage: React.FC = () => {
  const { creatorId } = useParams();
  const [products, setProducts] = useState<ProductMinimised[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const useInspectionData = process.env.REACT_APP_USE_MOCKS === 'true';

  useEffect(() => {
    if (useInspectionData) {
      setProducts(storefrontInspectionProducts);
      setLoading(false);
      setError(null);
      return undefined;
    }

    if (creatorId) {
      let isMounted = true;

      getAllProductsMinimalByUserAPI(creatorId)
        .then((data) => {
          if (isMounted) {
            setProducts(data);
          }
        })
        .catch(() => {
          if (isMounted) {
            setError('Failed to load products.');
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }

    setLoading(false);
    return undefined;
  }, [creatorId, useInspectionData]);

  const profile = useMemo(() => {
    if (useInspectionData) {
      return {
        displayName: `${storefrontInspectionUser.firstName} ${storefrontInspectionUser.lastName}`,
        title: storefrontInspectionUser.title,
        tagline: storefrontInspectionUser.taglineMission,
        bio: storefrontInspectionUser.bio,
        website: storefrontInspectionUser.website,
        imageUrl: storefrontInspectionUser.imageUrl,
        socialLinks: storefrontInspectionUser.socialLinks,
      };
    }

    return getProfileFromProducts(products, creatorId);
  }, [creatorId, products, useInspectionData]);

  const storefront = useMemo(
    () =>
      getStorefrontViewModel({
        profile,
        products,
        featuredProductId: useInspectionData
          ? storefrontInspectionFeaturedProductId
          : undefined,
      }),
    [products, profile, useInspectionData],
  );

  if (loading) {
    return (
      <main className="storefront-route-state" aria-busy="true">
        <h1>Loading Storefront</h1>
        <p>Preparing this creator&apos;s public page.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="storefront-route-state" role="alert">
        <h1>Storefront unavailable</h1>
        <p>{error}</p>
      </main>
    );
  }

  return <StorefrontPublicPage storefront={storefront} />;
};

export default StorefrontPage;
