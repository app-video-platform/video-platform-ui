import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navigation from './pages/nav/nav.component';
import About from './pages/about/about.component';
import Home from './pages/home/home.component';
import Contact from './pages/contact/contact.component';

const App: React.FC = () => (
  <div>
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  </div>
);

export default App;
