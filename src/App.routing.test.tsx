import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import App from './App';
import { UserRole } from '@core/api';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('core/providers', () => {
  const actual = jest.requireActual('core/providers');
  const ReactActual = jest.requireActual<typeof import('react')>('react');
  return {
    ...actual,
    AppInitializer: ({ children }: { children: React.ReactNode }) =>
      ReactActual.createElement(ReactActual.Fragment, null, children),
  };
});

jest.mock('@shared/pages', () => ({
  DevDashboard: () => <div>Dev dashboard</div>,
  NotFoundPage: () => <div>Not found</div>,
  UnauthorizedPage: () => <div>Unauthorized</div>,
}));

jest.mock('@domains/app/pages', () => {
  const ReactActual = jest.requireActual<typeof import('react')>('react');
  const makePage = (name: string) => () =>
    ReactActual.createElement('div', null, name);
  const MockOutletPage = () => {
    const { Outlet } = jest.requireActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
    return ReactActual.createElement(Outlet);
  };
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
    Onboarding: makePage('Onboarding wizard'),
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

const mockDispatch = jest.fn();
let mockAuth: Record<string, unknown>;

const makeAuth = (role: UserRole, onboardingCompleted: boolean) => ({
  user: {
    id: `user-${role.toLowerCase()}`,
    firstName: 'Test',
    lastName: 'Person',
    email: 'test@example.test',
    roles: [role],
    onboardingCompleted,
  },
  sessionStatus: 'authenticated',
  sessionVersion: 1,
  loading: false,
  isUserLoggedIn: true,
  error: null,
  profileError: null,
});

const renderApp = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

beforeEach(() => {
  mockAuth = makeAuth(UserRole.CREATOR, false);
  (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
    selector({ auth: mockAuth }),
  );
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  mockDispatch.mockReset();
});

describe('application onboarding route', () => {
  it.each([UserRole.CREATOR, UserRole.USER, UserRole.ADMIN])(
    'loads and reloads the canonical wizard for incomplete %s profiles',
    (role) => {
      mockAuth = makeAuth(role, false);
      const firstLoad = renderApp('/onboarding');
      expect(screen.getByText('Onboarding wizard')).toBeInTheDocument();
      firstLoad.unmount();

      renderApp('/onboarding');
      expect(screen.getByText('Onboarding wizard')).toBeInTheDocument();
    },
  );

  it('routes an incomplete profile to the canonical wizard after sign-in', async () => {
    let dispatchCount = 0;
    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') {
        dispatchCount += 1;
        if (dispatchCount === 2) {
          mockAuth = makeAuth(UserRole.CREATOR, false);
          return { unwrap: () => Promise.resolve(mockAuth.user) };
        }
        return { unwrap: () => Promise.resolve('Login successful') };
      }
      return action;
    });

    renderApp('/auth/login');
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'creator@example.test' },
    });
    fireEvent.change(screen.getByTestId('input-password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Onboarding wizard')).toBeInTheDocument();
  });

  it('never mounts onboarding while authentication is unresolved', () => {
    mockAuth = {
      user: null,
      sessionStatus: 'resolving',
      sessionVersion: 0,
      loading: true,
      isUserLoggedIn: null,
    };

    const { container } = renderApp('/onboarding');

    expect(screen.queryByText('Onboarding wizard')).not.toBeInTheDocument();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('redirects an authenticated identity without an allowed role', () => {
    mockAuth = {
      ...makeAuth(UserRole.CREATOR, false),
      user: { ...makeAuth(UserRole.CREATOR, false).user, roles: [] },
    };

    renderApp('/onboarding');

    expect(screen.queryByText('Onboarding wizard')).not.toBeInTheDocument();
    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
  });
});
