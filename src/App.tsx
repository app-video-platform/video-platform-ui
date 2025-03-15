import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.component';
import About from './pages/about/about.component';
import EmailSent from './pages/email-sent/email-sent.component';
import SignIn from './pages/sign-in/sign-in.component';
import SignUp from './pages/sign-up/sign-up.component';
import VerifyEmail from './pages/verify-email/verify-email.component';
import AppInitializer from './utils/app-initializer.util';
import Navigation from './pages/nav/nav.component';
import Contact from './pages/contact/contact.component';
import NotFoundPage from './pages/errors/not-found/not-found.component';
import UnauthorizedPage from './pages/errors/unauthorized/unauthorized.component';
import Dashboard from './galactica-app/dashboard/dashboard.component';
import CreateProduct from './galactica-app/products/create-product/create-product.component';
import ProductsList from './galactica-app/products/products-list/products-list.component';
import ProductsLayout from './galactica-app/products/products-layout.component';
import UserPagePreview from './galactica-app/user-page-preview/user-page-preview.component';
import UserDashboard from './galactica-app/user-dashboard/user-dashboard.component';

const App = () => (
  <AppInitializer>
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="signup" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/email-sent" element={<EmailSent />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<UserDashboard />} />
        <Route path="products" element={<ProductsLayout />} >
          <Route index element={<ProductsList />} />
          <Route path='create' element={<CreateProduct />} />
        </Route>
        <Route path='my-page-preview' element={<UserPagePreview />} />
      </Route>
    </Routes>

  </AppInitializer>
);

export default App;