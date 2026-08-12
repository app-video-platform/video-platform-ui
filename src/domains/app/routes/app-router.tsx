import React from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  AllProductsTab,
  AdminAuditPage,
  AdminPage,
  AdminProductsPage,
  AdminUsersPage,
  AppLayout,
  Cart,
  ConsultationTab,
  CoursesTab,
  CreatorAnalytics,
  CreatorDashboard,
  CustomerDetail,
  DownloadPackagesTab,
  ExplorePage,
  GalacticaHome,
  LibraryPage,
  Onboarding,
  ProductForm,
  ProductPage,
  ProductsList,
  CustomersList,
  SalesPage,
  SearchResultsPage,
  SettingsPage,
  StorefrontPage,
  CreatorStorefrontPage,
  WishlistTab,
} from '../pages';
import { ProtectedRoute } from '@core/providers';
import { getPrimaryRole, UserRole } from '@core/api';
import { selectAuthUser } from '@core/store/auth-store';

const RoleHome: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const primaryRole = getPrimaryRole(user?.roles);

  if (primaryRole === UserRole.ADMIN) {
    return <AdminPage />;
  }

  if (primaryRole === UserRole.CREATOR) {
    return <CreatorDashboard />;
  }

  return <GalacticaHome />;
};

const AppRouter: React.FC = () => (
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
    <Route path="/" element={<AppLayout />}>
      {/* Public routes under /app */}
      <Route path="explore" element={<ExplorePage />} />
      <Route path="explore/search" element={<SearchResultsPage />} />
      <Route path="product/:id" element={<ProductPage />} />
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
        {/* Shared dashboard home */}
        <Route index element={<RoleHome />} />

        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="audit" element={<AdminAuditPage />} />
        </Route>

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
          <Route path="edit/:id" element={<ProductForm />} />
          <Route path="edit/:type/:id" element={<ProductForm />} />
        </Route>

        <Route
          path="customers"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomersList />} />
          <Route path=":customerId" element={<CustomerDetail />} />
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
          path="analytics"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}>
              <CreatorAnalytics />
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
        <Route
          path="storefront"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}>
              <CreatorStorefrontPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-page-preview"
          element={<Navigate to="/app/storefront" replace />}
        />
        <Route path="cart" element={<Cart />} />

        {/* Fallback inside /app */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRouter;
