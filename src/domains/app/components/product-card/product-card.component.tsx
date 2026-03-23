import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { AbstractProduct, ProductMinimised } from 'core/api/models';
import { Button, StatusChip } from '@shared/ui';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../assets/image-placeholder.png');

import './product-card.styles.scss';

type ProductCardProduct = (AbstractProduct | ProductMinimised) & {
  name?: string;
  title?: string;
};

interface ProductCardProps {
  product: ProductCardProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const imgSrc = product.imageUrl ? product.imageUrl : placeholderImage;
  const productName = product.name ?? product.title ?? 'Untitled product';

  const parseProductDate = (value?: Date | string | null) => {
    if (!value) {
      return null;
    }
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const lastUpdatedDate =
    parseProductDate(product.updatedAt ?? product.createdAt) ?? new Date();

  const handlePublishProduct = () => {
    // eslint-disable-next-line no-console
    console.log('Want to publish it?');
  };

  const handleGoToEdit = () => {
    navigate(`edit/${product.id}`);
  };

  return (
    <div className="product-card">
      <img src={imgSrc} alt={productName} className="product-card-image" />
      <div className="product-card-details">
        <div className="product-card-header">
          <div>
            <h2>{productName}</h2>
            <p className="product-type">{product.type}</p>
          </div>
          <div className="status-wrapper">
            <span className="last-update">
              Last update: {format(lastUpdatedDate, 'EEE, do MMM')}
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
