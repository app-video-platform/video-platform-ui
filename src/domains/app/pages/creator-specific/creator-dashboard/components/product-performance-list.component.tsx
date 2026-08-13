import React from 'react';
import { Link } from 'react-router-dom';

import { DashboardTopProduct } from 'core/api/models';

import './product-performance-list.styles.scss';

interface ProductPerformanceListProps {
  items: DashboardTopProduct[];
}

const ProductPerformanceList: React.FC<ProductPerformanceListProps> = ({
  items,
}) => (
  <div className="product-performance-list">
    {items.map((item) => {
      const content = (
        <>
          <div className="product-performance-list__thumbnail">
            {item.thumbnailUrl ? (
              <img src={item.thumbnailUrl} alt="" />
            ) : (
              <span>{item.name.charAt(0)}</span>
            )}
          </div>
          <div className="product-performance-list__body">
            <div className="product-performance-list__title-row">
              <div>
                <h3>{item.name}</h3>
                <span>{item.type}</span>
              </div>
              <strong>{item.revenue}</strong>
            </div>
            <div
              className="product-performance-list__meter"
              aria-label={`${item.name} revenue share ${item.revenueShare}%`}
            >
              <span style={{ width: `${item.revenueShare}%` }} />
            </div>
          </div>
        </>
      );

      if (item.destinationPath) {
        return (
          <Link
            key={item.id}
            className="product-performance-list__row product-performance-list__row--interactive"
            to={item.destinationPath}
            aria-label={`Open ${item.name} product overview`}
          >
            {content}
          </Link>
        );
      }

      return (
        <article key={item.id} className="product-performance-list__row">
          {content}
        </article>
      );
    })}
  </div>
);

export default ProductPerformanceList;
