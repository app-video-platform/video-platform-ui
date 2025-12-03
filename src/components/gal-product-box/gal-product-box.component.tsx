import React from 'react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../assets/image-placeholder.png');

import { Button } from '@shared/ui';
import { ProductMinimised } from '@api/models';

import './gal-product-box.styles.scss';

interface GalProductCardProps {
  product: ProductMinimised;
}

const GalProductCard: React.FC<GalProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  // If product.image is missing or empty, use the placeholder
  // const imageUrl =
  //   product.image && product.image.trim() !== ''
  //     ? product.image
  //     : placeholderImage;

  return (
    <div className="product-card">
      <img
        src={placeholderImage}
        alt={product.name}
        className="product-card-image"
      />
      <div className="product-card-details">
        <div className="last-updated-line">
          <span>
            {/* {product.updatedAt.toLocaleString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })} */}
          </span>
        </div>
        <h3>{product.name}</h3>
        <div className="type-and-price-line">
          <span>{product.type?.toLowerCase()}</span>
          <span>
            {product.price !== 'free' && <span>&euro;</span>}
            {product.price}
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => navigate(`/app/product/${product.id}/${product.type}`)}
      >
        View Product
      </Button>
    </div>
  );
};
export default GalProductCard;
