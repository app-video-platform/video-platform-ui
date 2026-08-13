import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import httpClient from 'core/api/http-client';
import { registerCreatorDashboardTestMocks } from 'core/api/test-fixtures/creator-dashboard-http.mock';
import authReducer from 'core/store/auth-store/auth.slice';
import dashboardReducer from 'core/store/dashboard-store/dashboard.slice';
import { UserRole } from 'core/api/models';
import CreatorDashboard from './creator-dashboard.component';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: {
      children: React.ReactNode;
      to: string;
    }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => mockNavigate,
  };
});

jest.mock('@shared/ui', () => ({
  __esModule: true,
  Button: ({
    children,
    disabled,
    onClick,
    title,
    type,
    variant,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    title?: string;
    type?: 'button' | 'submit';
    variant?: string;
  }) => (
    <button
      type={type ?? 'button'}
      data-variant={variant}
      disabled={disabled}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  Icon: () => <span data-testid="icon" />,
}));

const creatorUser = {
  id: 'creator-1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  roles: [UserRole.CREATOR],
};

const renderDashboard = (roles = [UserRole.CREATOR]) => {
  const testStore = configureStore({
    reducer: {
      auth: authReducer,
      dashboard: dashboardReducer,
    },
    preloadedState: {
      auth: {
        user: { ...creatorUser, roles },
        loading: false,
        error: null,
        isUserLoggedIn: true,
      },
    },
  });

  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <CreatorDashboard />
      </MemoryRouter>
    </Provider>,
  );
};

describe('<CreatorDashboard />', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    mock = new MockAdapter(httpClient);
    registerCreatorDashboardTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
    cleanup();
  });

  it('renders business overview sections from the dashboard summary endpoint', async () => {
    renderDashboard();

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText(/good/i)).toHaveTextContent('Ada');
    expect(await screen.findByText('€3,429')).toBeInTheDocument();
    expect(screen.getByText('Recent activity')).toBeInTheDocument();
    expect(screen.getByText('Top products')).toBeInTheDocument();
    expect(screen.getByText('Needs attention')).toBeInTheDocument();
    expect(mock.history.get[0].url).toBe('api/creator/dashboard/summary');
  });

  it('removes account-profile emphasis from the dashboard', async () => {
    renderDashboard();

    await screen.findByText('€3,429');
    expect(screen.queryByText('ada@example.com')).toBeNull();
    expect(screen.queryByText(/member since/i)).toBeNull();
    expect(screen.queryByText(/most successful products/i)).toBeNull();
  });

  it('navigates from deterministic attention actions and preserves disabled actions', async () => {
    renderDashboard();

    await screen.findByText('€3,429');
    fireEvent.click(screen.getByRole('button', { name: 'Add media' }));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/app/products/edit/prod-membership-lab',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reconnect' }));
    expect(mockNavigate).toHaveBeenCalledWith('/app/settings?tab=calendar');

    fireEvent.click(screen.getByRole('button', { name: 'Review drafts' }));
    expect(mockNavigate).toHaveBeenCalledWith('/app/products');

    expect(screen.getByRole('button', { name: 'No action' })).toBeDisabled();
  });

  it('links only metrics with meaningful destinations', async () => {
    renderDashboard();

    await screen.findByText('€3,429');
    expect(screen.getByRole('link', { name: /view revenue details/i })).toHaveAttribute(
      'href',
      '/app/sales',
    );
    expect(screen.getByRole('link', { name: /view sales details/i })).toHaveAttribute(
      'href',
      '/app/sales',
    );
    expect(
      screen.queryByRole('link', { name: /view customers details/i }),
    ).toBeNull();
    expect(
      screen.queryByRole('link', { name: /view active memberships details/i }),
    ).toBeNull();
  });

  it('links top products to their product workspaces', async () => {
    renderDashboard();

    await screen.findByText('€3,429');
    expect(
      screen.getByRole('link', { name: /edit creator product growth system/i }),
    ).toHaveAttribute('href', '/app/products/edit/prod-course-growth');
    expect(screen.getByRole('link', { name: /edit launch toolkit/i })).toHaveAttribute(
      'href',
      '/app/products/edit/prod-launch-toolkit',
    );
  });

  it('keeps activity navigation specific to meaningful existing destinations', async () => {
    renderDashboard();

    await screen.findByText('€3,429');
    expect(
      screen.getByRole('link', { name: /open product updated: launch toolkit/i }),
    ).toHaveAttribute('href', '/app/products/edit/prod-launch-toolkit');
    expect(screen.queryByRole('link', { name: /open new sale/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /open payment failed/i })).toBeNull();
  });

  it('uses honest unavailable states when the backend contract is missing', async () => {
    mock.resetHandlers();
    mock.onAny().reply(404);

    renderDashboard();

    expect(await screen.findAllByText('Unavailable')).toHaveLength(4);
    expect(
      screen.getByText(/activity will appear here once business events are available/i),
    ).toBeInTheDocument();
  });

  it('renders the shared dashboard boundary for non-creators', () => {
    renderDashboard([UserRole.USER]);

    expect(
      screen.getByText(/creator business tools are available/i),
    ).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(0);
  });
});
