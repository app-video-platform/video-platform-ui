import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ProductEntitlement,
  ProductType,
} from 'core/api/models';
import { getMyEntitlementsAPI } from 'core/api/services';
import { Button } from '@shared/ui';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../../assets/image-placeholder.png');

import './library-page.styles.scss';

interface LibraryProductsProps {
  type?: ProductType;
}

const LibraryProducts: React.FC<LibraryProductsProps> = ({ type }) => {
  const navigate = useNavigate();
  const [entitlements, setEntitlements] = useState<ProductEntitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getMyEntitlementsAPI({ type })
      .then((result) => {
        if (mounted) {
          setEntitlements(result);
        }
      })
      .catch(() => {
        if (mounted) {
          setError('Your library could not be loaded.');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [type]);

  if (loading) {
    return <p>Loading your library...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (entitlements.length === 0) {
    return <p>You do not have any products in this section yet.</p>;
  }

  return (
    <div className="library-products">
      {entitlements.map(({ id, product }) => (
        <article key={id} className="library-product">
          <img
            src={product.imageUrl || placeholderImage}
            alt={product.title || 'Product'}
          />
          <div>
            <h2>{product.title || 'Untitled product'}</h2>
            <p>{product.type}</p>
            <p>{product.description}</p>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate(`/app/product/${product.id}`)}
          >
            Open
          </Button>
        </article>
      ))}
    </div>
  );
};

export default LibraryProducts;
