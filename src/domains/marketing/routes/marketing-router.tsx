import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { About, Home, Pricing, Contact } from '../pages';
import { Navigation } from '../widgets';

const MarketingRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigation />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="contact" element={<Contact />} />
    </Route>
  </Routes>
);

export default MarketingRouter;
