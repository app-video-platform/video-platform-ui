import React from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
} from '../pages';
import { selectAuthUser } from '@core/store';
import { ProtectedRoute } from '@core/providers';
import { UserRole } from '@core/api';

const AppRouter: React.FC = () => {
  const user = useSelector(selectAuthUser);

  return (
    <Routes>
      {/* Onboarding lives at root (same as your current setup) */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute
            allowedRoles={[UserRole.ADMIN, UserRole.CREATOR, UserRole.USER]}
          >
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* /app englobes the whole app part (public + protected routes) */}
      <Route path="/app" element={<AppLayout />}>
        {/* Public routes under /app */}
        <Route path="explore" element={<ExplorePage />} />
        <Route path="explore/search" element={<SearchResultsPage />} />
        <Route path="product/:id/:type" element={<ProductPage />} />
        <Route path="store/:creatorId" element={<StorefrontPage />} />

        {/* Protected wrapper */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ADMIN, UserRole.CREATOR, UserRole.USER]}
            >
              <Outlet />
            </ProtectedRoute>
          }
        >
          {/* Role-based home */}
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

          {/* Creator/Admin: products */}
          <Route
            path="products"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}>
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
              <ProtectedRoute allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}>
                <SalesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="marketing"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}>
                <MarketingPage />
              </ProtectedRoute>
            }
          />

          {/* User/Admin: library */}
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

          {/* Fallback inside /app */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
