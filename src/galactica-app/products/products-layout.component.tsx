import React from 'react';
import { Outlet } from 'react-router-dom';

const ProductsLayout: React.FC = () => (
  <div>
    <Outlet />
  </div>
);

export default ProductsLayout;