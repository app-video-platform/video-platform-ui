import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
import ProductsList from './galactica-app/creator-specific/products/products-list/products-list.component';
import UserPagePreview from './galactica-app/creator-specific//user-page-preview/user-page-preview.component';
import Onboarding from './galactica-app/onboarding/onboarding.component';
import ForgotPassword from './static-pages/forgot-password/forgot-password.component';
import ProductForm from './galactica-app/creator-specific/products/product-form/product-form.component';
import Pricing from './static-pages/pricing/pricing.component';
import SalesPage from './galactica-app/creator-specific/sales-page/sales-page.component';
import MarketingPage from './galactica-app/creator-specific/marketing-page/marketing-page.component';
import GalacticaHome from './galactica-app/normal-user-specific/galactica-home/galactica-home.component';
import DevDashboard from './static-pages/dev-dashboard/dev-dashboard.component';
import AppLayout from './galactica-app/app-layout/app-layout.component';
import { UserRole } from './api/models/user/user';
import LibraryPage from './galactica-app/normal-user-specific//library-page/library-page.component';
import { selectAuthUser } from './store/auth-store/auth.selectors';
import AdminPage from './galactica-app/admin-page/admin-page.component';
import CreatorDashboard from './galactica-app/creator-specific/creator-dashboard/creator-dashboard.component';
import StorefrontPage from './galactica-app/storefront-page/storefront-page.component';
import ExplorePage from './galactica-app/explore-page/explore-page.component';
import ProductPage from './galactica-app/product-page/product-page.component';
import SettingsPage from './galactica-app/settings-page/settings-page.component';
import SearchResultsPage from './galactica-app/explore-page/search-page/search-page.component';

const App = () => {
  const user = useSelector(selectAuthUser);

  return (
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

        {/* <Route path="onboarding" element={<Onboarding />} /> */}

        {/* Public storefront and explore */}
        {/* <Route path="store/:creatorId" element={<StorefrontPage />} />
        <Route path="app/explore" element={<ExplorePage />} />
        <Route path="app/explore/search" element={<SearchResultsPage />} />
        <Route path="product/:id/:type" element={<ProductPage />} /> */}

        <Route
          path="onboarding"
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ADMIN, UserRole.CREATOR, UserRole.USER]}
            >
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* <Route path="onboarding" element={<Onboarding />} /> */}

        {/* /app englobes the whole app part of the project (restricted + visitors allowed) */}
        <Route path="app/" element={<AppLayout />}>
          {/* These are a series of routes under /app which are not protected (allowed for visitors as well) */}
          <Route path="explore" element={<ExplorePage />} />
          <Route path="explore/search" element={<SearchResultsPage />} />
          <Route path="product/:id/:type" element={<ProductPage />} />
          <Route path="store/:creatorId" element={<StorefrontPage />} />

          {/* Role-based home: creators see dashboard, users see library */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[UserRole.ADMIN, UserRole.CREATOR, UserRole.USER]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                user?.roles.includes(UserRole.CREATOR) ? (
                  <CreatorDashboard />
                ) : user?.roles.includes(UserRole.ADMIN) ? (
                  <AdminPage />
                ) : (
                  <GalacticaHome />
                )
              }
            />
            {/* Creator-only product management */}
            <Route
              path="products/"
              element={
                <ProtectedRoute
                  allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}
                >
                  {/* <ProductsLayout /> */}
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProductsList />} />
              <Route path="create" element={<ProductForm />} />
              <Route path="edit/:type/:id" element={<ProductForm />} />
            </Route>
            <Route
              path="sales"
              element={
                <ProtectedRoute
                  allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}
                >
                  <SalesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="marketing"
              element={
                <ProtectedRoute
                  allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}
                >
                  <MarketingPage />
                </ProtectedRoute>
              }
            />
            {/* User-only library */}
            <Route
              path="library"
              element={
                <ProtectedRoute allowedRoles={[UserRole.USER, UserRole.ADMIN]}>
                  <LibraryPage />
                </ProtectedRoute>
              }
            />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="my-page-preview" element={<UserPagePreview />} />
            {/* Fallback inside /app */}
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>
        </Route>
      </Routes>
    </AppInitializer>
  );
};

export default App;
