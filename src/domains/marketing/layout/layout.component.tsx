import React from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '../components';
import { Navigation } from '../widgets';

import './layout.styles.scss';

const MarketingLayout: React.FC = () => (
  <div className="site-layout">
    <Navigation />
    <Outlet />
    <Footer />
  </div>
);

export default MarketingLayout;
