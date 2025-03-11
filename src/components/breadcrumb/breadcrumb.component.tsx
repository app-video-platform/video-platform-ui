import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './breadcrumb.styles.scss';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  // Split the pathname into segments, filtering out empty values
  // e.g. "/dashboard/products/new" -> ["dashboard", "products", "new"]
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="breadcrumb">
      <ul className="breadcrumb-list">
        {pathnames.map((segment, index) => {
          // Build the path up to this segment
          const to = '/' + pathnames.slice(0, index + 1).join('/');

          // Check if this is the last segment (no link)
          const isLast = index === pathnames.length - 1;

          // You might want to map segments to human-friendly labels
          // e.g. "products" -> "Products"
          const labelMap: Record<string, string> = {
            dashboard: 'Dashboard',
            products: 'Products',
            new: 'New',
            // etc.
          };
          const label = labelMap[segment] || segment;

          return (
            <li key={segment}>
              {isLast ? (
                <span className="breadcrumb-current">{label}</span>
              ) : (
                <Link to={to} className='breadcrumb-element'>{label}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
