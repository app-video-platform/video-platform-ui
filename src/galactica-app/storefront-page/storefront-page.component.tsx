import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectAuthUser } from '../../store/auth-store/auth.selectors';

import './storefront-page.styles.scss';
import { IMinimalProduct } from '../../api/models/product/product';
import { getAllProductsMinimalByUserAPI } from '../../api/services/products/products-api';

const StorefrontPage: React.FC = () => {
  const { creatorId } = useParams();
  const user = useSelector(selectAuthUser);
  const [products, setProducts] = useState<IMinimalProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (creatorId) {
      let isMounted = true; // ↪️ prevent state updates after unmount

      // call your service
      getAllProductsMinimalByUserAPI(creatorId)
        .then((data) => {
          if (isMounted) {
            setProducts(data);
          }
        })
        .catch((err) => {
          console.error(err);
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
  }, []); // empty deps → runs once on mount

  // if (loading) {
  //   return <p>Loading products…</p>;
  // }
  // if (error) {
  //   return <p>{error}</p>;
  // }

  return (
    <div className="storefront-page">
      <main className="storefront-page-content">
        <section className="hero">
          <div className="creator-profile-image" />
          <div className="hero-content">
            <h1></h1>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StorefrontPage;
