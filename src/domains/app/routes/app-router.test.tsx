/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AppRouter from './app-router';
import { UserRole } from '@core/api';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../pages', () => {
  const React = require('react');
  const { Outlet } = require('react-router-dom');
  const makePage = (name: string) => () => <div>{name}</div>;

  return {
    AllProductsTab: makePage('All products'),
    AdminAuditPage: makePage('Admin audit'),
    AdminPage: makePage('Admin dashboard'),
    AdminProductsPage: makePage('Admin products'),
    AdminUsersPage: makePage('Admin users'),
    AppLayout: () => <Outlet />,
    Cart: makePage('Cart'),
    ConsultationTab: makePage('Consultations'),
    CoursesTab: makePage('Courses'),
    CreatorDashboard: makePage('Creator dashboard'),
    DownloadPackagesTab: makePage('Downloads'),
    ExplorePage: makePage('Explore'),
    GalacticaHome: makePage('User home'),
    LibraryPage: () => <Outlet />,
    MarketingPage: makePage('Marketing'),
    Onboarding: makePage('Onboarding'),
    ProductForm: makePage('Product form'),
    ProductPage: makePage('Product page'),
    ProductsList: makePage('Products list'),
    SalesPage: makePage('Sales'),
    SearchResultsPage: makePage('Search results'),
    SettingsPage: makePage('Settings'),
    StorefrontPage: makePage('Storefront'),
    UserPagePreview: makePage('Preview'),
    WishlistTab: makePage('Wishlist'),
  };
});

const renderRouter = (roles: UserRole[], initialEntry = '/') => {
  const state = {
    auth: {
      user: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.test',
        roles,
      },
      loading: false,
      error: null,
      isUserLoggedIn: true,
    },
  };
  (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
    selector(state),
  );

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppRouter />
    </MemoryRouter>,
  );
};

describe('AppRouter role routing', () => {
  it('resolves / to the admin dashboard for admins', () => {
    renderRouter([UserRole.ADMIN]);

    expect(screen.getByText('Admin dashboard')).toBeInTheDocument();
  });

  it('resolves / to the creator dashboard for creators', () => {
    renderRouter([UserRole.CREATOR]);

    expect(screen.getByText('Creator dashboard')).toBeInTheDocument();
  });

  it('resolves / to normal home for users', () => {
    renderRouter([UserRole.USER]);

    expect(screen.getByText('User home')).toBeInTheDocument();
  });

  it('renders admin user management for admins', () => {
    renderRouter([UserRole.ADMIN], '/admin/users');

    expect(screen.getByText('Admin users')).toBeInTheDocument();
  });
});
