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
  const ReactActual = jest.requireActual<typeof import('react')>('react');
  const { Outlet } =
    jest.requireActual<typeof import('react-router-dom')>('react-router-dom');

  const makePage = (name: string) => {
    const MockPage = () => ReactActual.createElement('div', null, name);
    MockPage.displayName = `Mock${name.replace(/\s+/g, '')}`;
    return MockPage;
  };

  const MockOutletPage = () => ReactActual.createElement(Outlet);
  MockOutletPage.displayName = 'MockOutletPage';

  return {
    AllProductsTab: makePage('All products'),
    AdminAuditPage: makePage('Admin audit'),
    AdminPage: makePage('Admin dashboard'),
    AdminProductsPage: makePage('Admin products'),
    AdminUsersPage: makePage('Admin users'),
    AppLayout: MockOutletPage,
    Cart: makePage('Cart'),
    ConsultationTab: makePage('Consultations'),
    CoursesTab: makePage('Courses'),
    CreatorAnalytics: makePage('Analytics'),
    CreatorDashboard: makePage('Creator dashboard'),
    CustomerDetail: makePage('Customer detail'),
    CustomersList: makePage('Customers list'),
    DownloadPackagesTab: makePage('Downloads'),
    ExplorePage: makePage('Explore'),
    GalacticaHome: makePage('User home'),
    LibraryPage: MockOutletPage,
    Onboarding: makePage('Onboarding'),
    ProductForm: makePage('Product form'),
    ProductLandingPageBuilder: makePage('Product landing page builder'),
    ProductOverview: makePage('Product overview'),
    ProductPage: makePage('Product page'),
    ProductPreview: makePage('Product preview'),
    ProductsList: makePage('Products list'),
    SalesPage: makePage('Sales'),
    SearchResultsPage: makePage('Search results'),
    SettingsPage: makePage('Settings'),
    StorefrontPage: makePage('Storefront'),
    CreatorStorefrontPage: makePage('Creator Storefront'),
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

  it('renders creator customer routes for creators', () => {
    renderRouter([UserRole.CREATOR], '/customers');

    expect(screen.getByText('Customers list')).toBeInTheDocument();

    renderRouter([UserRole.CREATOR], '/customers/cust-1');

    expect(screen.getByText('Customer detail')).toBeInTheDocument();
  });

  it.each([
    ['/customers', 'Customers list'],
    ['/customers/cust-1', 'Customer detail'],
    ['/sales', 'Sales'],
    ['/analytics', 'Analytics'],
    ['/storefront', 'Creator Storefront'],
  ])('does not render Creator-only %s route for admins', (path, pageText) => {
    renderRouter([UserRole.ADMIN], path);

    expect(screen.queryByText(pageText)).toBeNull();
  });

  it('renders the Product Overview route without colliding with Product Workspace routes', () => {
    renderRouter([UserRole.CREATOR], '/products/product-1');

    expect(screen.getByText('Product overview')).toBeInTheDocument();

    renderRouter([UserRole.CREATOR], '/products/product-1/landing-page');

    expect(screen.getByText('Product landing page builder')).toBeInTheDocument();

    renderRouter([UserRole.CREATOR], '/products/product-1/preview');

    expect(screen.getByText('Product preview')).toBeInTheDocument();

    renderRouter([UserRole.CREATOR], '/products/edit/product-1');

    expect(screen.getByText('Product form')).toBeInTheDocument();
  });

  it('renders the Creator Storefront route and redirects the legacy preview route', () => {
    renderRouter([UserRole.CREATOR], '/storefront');

    expect(screen.getByText('Creator Storefront')).toBeInTheDocument();

    renderRouter([UserRole.CREATOR], '/my-page-preview');

    expect(screen.getByText('Creator Storefront')).toBeInTheDocument();
  });

  it('renders the public Storefront route outside the protected Creator route', () => {
    renderRouter([UserRole.USER], '/store/creator-1');

    expect(screen.getByText('Storefront')).toBeInTheDocument();
  });
});
