import React from 'react';

import { IProductResponse } from '../../api/models/product/product';

// import PlaceholderImage from '../../assets/image-placeholder.png';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../assets/image-placeholder.png');

import './gal-product-box.styles.scss';
import GalButton from '../gal-button/gal-button.component';
import { useNavigate } from 'react-router-dom';

interface GalProductCardProps {
  product: IProductResponse;
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
      <GalButton
        text="View Product"
        type="secondary"
        onClick={() => navigate(`/product/${product.id}/${product.type}`)}
      />
    </div>
  );
};
export default GalProductCard;
