import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { AbstractProduct } from '@api/models';
import { Button, StatusChip } from '@shared/ui';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../assets/image-placeholder.png');

import './product-card.styles.scss';

interface ProductCardProps {
  product: AbstractProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const imgSrc = product.imageUrl ? product.imageUrl : placeholderImage;

  const handlePublishProduct = () => {
    // eslint-disable-next-line no-console
    console.log('Want to publish it?');
  };

  const handleGoToEdit = () => {
    navigate(`edit/${product.type}/${product.id}`);
  };

  return (
    <div className="product-card">
      <img src={imgSrc} alt={product.name} className="product-card-image" />
      <div className="product-card-details">
        <div className="product-card-header">
          <div>
            <h2>{product.name}</h2>
            <p className="product-type">{product.type}</p>
          </div>
          <div className="status-wrapper">
            <span className="last-update">
              Last update:{' '}
              {format(product.createdAt ?? new Date(), 'EEE, do MMM')}
            </span>
            <StatusChip status={product.status ?? 'DRAFT'} />
          </div>
        </div>

        <div className="card-row">
          <span>{product.price}</span>

          <div className="product-card-btns">
            <Button
              type="button"
              variant="primary"
              onClick={handlePublishProduct}
            >
              Publish
            </Button>
            <Button type="button" variant="secondary" onClick={handleGoToEdit}>
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
