import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'sonner';

import RoutesDev from './devtools/__routes-dev';
import { About, Contact, Home, Pricing } from '@pages/marketing-site';
import {
  EmailSent,
  ForgotPassword,
  SignIn,
  SignUp,
  VerifyEmail,
} from '@pages/auth';
import {
  AdminPage,
  AllProductsTab,
  AppLayout,
  Cart,
  ConsultationTab,
  CoursesTab,
  CreatorDashboard,
  DownloadPackagesTab,
  ExplorePage,
  GalacticaHome,
  LibraryPage,
  MarketingPage,
  Onboarding,
  ProductForm,
  ProductPage,
  ProductsList,
  SalesPage,
  SearchResultsPage,
  SettingsPage,
  StorefrontPage,
  UserPagePreview,
  WishlistTab,
} from '@pages/app';
import { DevDashboard, NotFoundPage, UnauthorizedPage } from '@pages/shared';
import { AppInitializer, ProtectedRoute } from '@api/providers';
import { UserRole } from '@api/models';
import { selectAuthUser } from '@store/auth-store';
import { Navigation } from '@widgets/nav';
import Checkout from './galactica-app/normal-user-specific/checkout/checkout.component';

const App = () => {
  const user = useSelector(selectAuthUser);

  return (
    <AppInitializer>
      <Toaster position="top-center" richColors closeButton />
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<SignIn />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/email-sent" element={<EmailSent />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dev-dashboard" element={<DevDashboard />} />

        {process.env.NODE_ENV === 'development' && (
          <Route path="__routes-dev" element={<RoutesDev />} />
        )}
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
            >
              <Route path="all-products" element={<AllProductsTab />} />
              <Route path="my-courses" element={<CoursesTab />} />
              <Route
                path="my-download-packages"
                element={<DownloadPackagesTab />}
              />
              <Route path="my-consultation" element={<ConsultationTab />} />
              <Route path="my-wishlist" element={<WishlistTab />} />
            </Route>
            <Route path="settings" element={<SettingsPage />} />

            <Route path="my-page-preview" element={<UserPagePreview />} />

            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />

            {/* Fallback inside /app */}
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>
        </Route>
      </Routes>
    </AppInitializer>
  );
};

export default App;
