import React from 'react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../assets/image-placeholder.png');

import { Button } from '@shared/ui';
import { ProductMinimised } from 'core/api/models';

import './product-box.styles.scss';

interface ProductBoxProps {
  product: ProductMinimised;
}

const ProductBox: React.FC<ProductBoxProps> = ({ product }) => {
  const navigate = useNavigate();
  const productName = product.title ?? 'Untitled product';
  // If product.image is missing or empty, use the placeholder
  // const imageUrl =
  //   product.image && product.image.trim() !== ''
  //     ? product.image
  //     : placeholderImage;

  return (
    <div className="product-box">
      <img
        src={placeholderImage}
        alt={productName}
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
        <h3>{productName}</h3>
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
        onClick={() => navigate(`/app/product/${product.id}`)}
      >
        View Product
      </Button>
    </div>
  );
};
export default ProductBox;
