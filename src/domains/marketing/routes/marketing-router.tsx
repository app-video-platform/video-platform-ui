import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { MarketingLayout } from '../layout';
import {
  About,
  Home,
  Pricing,
  Contact,
  GettingStarted,
  FeaturesPage,
  HelpCenter,
  Demo,
} from '../pages';

const MarketingRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<MarketingLayout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="contact" element={<Contact />} />
      <Route path="getting-started" element={<GettingStarted />} />
      <Route path="features" element={<FeaturesPage />} />
      <Route path="help" element={<HelpCenter />} />
      <Route path="demo" element={<Demo />} />
    </Route>
  </Routes>
);

export default MarketingRouter;
