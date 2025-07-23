import React from 'react';

import { IProductResponse } from '../../api/models/product/product';

// import PlaceholderImage from '../../assets/image-placeholder.png';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../assets/image-placeholder.png');

import './product-box.styles.scss';

interface ProductCardProps {
  product: IProductResponse;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  // If product.image is missing or empty, use the placeholder
  // const imageUrl =
  //   product.image && product.image.trim() !== ''
  //     ? product.image
  //     : placeholderImage;

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
    {/* ... other product details ... */}
  </div>
);
export default ProductCard;
