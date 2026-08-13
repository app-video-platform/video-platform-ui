import React from 'react';
import { Link } from 'react-router-dom';

import { ChartEmptyState } from '@shared/ui';
import { appRoutes } from 'domains/app/routes/routes';

import { ProductAnalyticsItem } from 'core/api/models';
import {
  formatAnalyticsMoney,
  formatAnalyticsNumber,
  formatAnalyticsPercent,
} from '../creator-analytics.utils';

interface ProductPerformanceSectionProps {
  products: ProductAnalyticsItem[];
}

const ProductPerformanceSection: React.FC<ProductPerformanceSectionProps> = ({
  products,
}) => {
  if (products.length === 0) {
    return (
      <ChartEmptyState
        title="No product performance data yet"
        message="Product rankings will appear once revenue and order data exists."
      />
    );
  }

  return (
    <div className="analytics-product-ranking">
      {products.map((product, index) => (
        <Link
          key={product.id}
          to={appRoutes.productsOverview(product.id)}
          className="analytics-product-ranking__row"
          aria-label={`Open ${product.name} product overview`}
          title={product.name}
        >
          <span className="analytics-product-ranking__rank">{index + 1}</span>
          <span className="analytics-product-ranking__identity">
            <span className="analytics-product-ranking__thumbnail" aria-hidden="true">
              {product.thumbnailUrl ? (
                <img src={product.thumbnailUrl} alt="" />
              ) : (
                product.name.charAt(0)
              )}
            </span>
            <span>
              <strong>{product.name}</strong>
              <small>{product.type}</small>
            </span>
          </span>
          <span className="analytics-product-ranking__value">
            <strong>{formatAnalyticsMoney(product.revenueCents)}</strong>
            <small>Revenue</small>
          </span>
          <span className="analytics-product-ranking__value">
            <strong>{formatAnalyticsNumber(product.orders)}</strong>
            <small>Orders</small>
          </span>
          <span className="analytics-product-ranking__share">
            <span>
              <strong>{formatAnalyticsPercent(product.share)}</strong>
              <small>Share</small>
            </span>
            <span
              className="analytics-product-ranking__meter"
              aria-label={`${product.name} revenue share ${formatAnalyticsPercent(product.share)}`}
            >
              <span style={{ width: `${product.share}%` }} />
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
};

export default ProductPerformanceSection;
