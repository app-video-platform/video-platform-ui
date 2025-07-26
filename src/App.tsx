import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './static-pages/home/home.component';
import About from './static-pages/about/about.component';
import EmailSent from './static-pages/email-sent/email-sent.component';
import SignIn from './static-pages/sign-in/sign-in.component';
import SignUp from './static-pages/sign-up/sign-up.component';
import VerifyEmail from './static-pages/verify-email/verify-email.component';
import AppInitializer from './utils/app-initializer.util';
import Navigation from './static-pages/nav/nav.component';
import Contact from './static-pages/contact/contact.component';
import NotFoundPage from './static-pages/errors/not-found/not-found.component';
import UnauthorizedPage from './static-pages/errors/unauthorized/unauthorized.component';
import ProtectedRoute from './utils/protected-route.util';
import Dashboard from './galactica-app/dashboard/dashboard.component';
import ProductsList from './galactica-app/products/products-list/products-list.component';
import ProductsLayout from './galactica-app/products/products-layout.component';
import UserPagePreview from './galactica-app/user-page-preview/user-page-preview.component';
import UserDashboard from './galactica-app/user-dashboard/user-dashboard.component';
import Onboarding from './galactica-app/onboarding/onboarding.component';
import ForgotPassword from './static-pages/forgot-password/forgot-password.component';
import ProductForm from './galactica-app/products/product-form/product-form.component';
import Pricing from './static-pages/pricing/pricing.component';
import SalesPage from './galactica-app/sales-page/sales-page.component';
import MarketingPage from './galactica-app/marketing-page/marketing-page.component';
import GalacticaHome from './galactica-app/galactica-home/galactica-home.component';
import DevDashboard from './static-pages/dev-dashboard/dev-dashboard.component';
import AppLayout from './galactica-app/app-layout/app-layout.component';
import { User } from 'lucide-react';
import { UserRole } from './api/models/user/user';
import ProductPage from './galactica-app/product-page/product-page.component';
import LibraryPage from './galactica-app/library-page/library-page.component';

const App = () => (
  <AppInitializer>
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="pricing" element={<Pricing />} />
      </Route>
      <Route path="signup" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/email-sent" element={<EmailSent />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dev-dashboard" element={<DevDashboard />} />

      {/* <Route
        path="onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      /> */}

      <Route path="onboarding" element={<Onboarding />} />
      {/* Protected route allowed for all types of users */}
      <Route
        path="app"
        element={
          <ProtectedRoute
            allowedRoles={[UserRole.ADMIN, UserRole.CREATOR, UserRole.USER]}
          >
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<GalacticaHome />} />
        <Route path="product/:id/:type" element={<ProductPage />} />

        {/* Protected route denied for users with role User*/}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}>
              {/* Outlet simply renders the matching child route */}
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="products" element={<ProductsLayout />}>
            <Route index element={<ProductsList />} />
            <Route path="create" element={<ProductForm />} />
            <Route path="edit/:type/:id" element={<ProductForm />} />
          </Route>
          <Route path="sales" element={<SalesPage />} />
          <Route path="my-page-preview" element={<UserPagePreview />} />
          <Route path="marketing" element={<MarketingPage />} />
        </Route>

        <Route
          path="library"
          element={
            <ProtectedRoute allowedRoles={[UserRole.USER, UserRole.ADMIN]}>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  </AppInitializer>
);

export default App;
