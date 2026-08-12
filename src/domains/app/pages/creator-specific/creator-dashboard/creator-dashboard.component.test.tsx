import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
import { useDispatch, useSelector } from 'react-redux';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  __esModule: true,
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
}));

jest.mock('@store/auth-store', () => ({
  __esModule: true,
  selectAuthUser: jest.fn(),
}));
import { selectAuthUser } from 'core/store/auth-store';

jest.mock('@store/product-store', () => ({
  __esModule: true,
  getAllProductsByUserId: jest.fn(),
  getProductSummariesByOwner: jest.fn(),
}));
import {
  getAllProductsByUserId,
  getProductSummariesByOwner,
} from 'core/store/product-store';

jest.mock('@shared/ui', () => ({
  __esModule: true,
  Button: ({
    children,
    onClick,
    type,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: string;
  }) => (
    <button type={type ?? 'button'} data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
  GalIcon: () => <span data-testid="gal-icon" />,
}));

import CreatorDashboard from './creator-dashboard.component';
import { UserRole } from 'core/api/models';

describe('<CreatorDashboard />', () => {
  const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
  const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
  const mockedGetAllProductsByUserId =
    getAllProductsByUserId as jest.MockedFunction<typeof getAllProductsByUserId>;
  const mockedGetProductSummariesByOwner =
    getProductSummariesByOwner as jest.MockedFunction<
      typeof getProductSummariesByOwner
    >;

  const originalUseMocks = process.env.REACT_APP_USE_MOCKS;

  let fakeDispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_USE_MOCKS = 'true';

    fakeDispatch = jest.fn();
    mockedUseDispatch.mockReturnValue(fakeDispatch as any);

    mockedUseSelector.mockImplementation((selector: any) => {
      if (selector === selectAuthUser) {
        return {
          id: 'creator-1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          roles: [UserRole.CREATOR],
        };
      }
      return undefined;
    });

    mockedGetProductSummariesByOwner.mockImplementation(
      ((ownerId: string) =>
        ({
          type: 'summaries',
          payload: ownerId,
        }) as any) as typeof getProductSummariesByOwner,
    );
    mockedGetAllProductsByUserId.mockImplementation(
      ((userId: string) =>
        ({
          type: 'products',
          payload: userId,
        }) as any) as typeof getAllProductsByUserId,
    );
  });

  afterEach(() => {
    process.env.REACT_APP_USE_MOCKS = originalUseMocks;
    cleanup();
  });

  it('loads product context for the signed-in creator and renders business overview sections', () => {
    render(<CreatorDashboard />);

    expect(mockedGetProductSummariesByOwner).toHaveBeenCalledWith('creator-1');
    expect(mockedGetAllProductsByUserId).toHaveBeenCalledWith('creator-1');
    expect(fakeDispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: 'summaries', payload: 'creator-1' }),
    );
    expect(fakeDispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: 'products', payload: 'creator-1' }),
    );

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText(/good/i)).toHaveTextContent('Ada');
    expect(screen.queryByText(/compact view of performance/i)).toBeNull();
    expect(screen.getAllByText('Revenue').length).toBeGreaterThan(0);
    expect(screen.getByText('Recent activity')).toBeInTheDocument();
    expect(screen.getByText('Top products')).toBeInTheDocument();
    expect(screen.getByText('Needs attention')).toBeInTheDocument();
  });

  it('removes account-profile emphasis from the dashboard', () => {
    render(<CreatorDashboard />);

    expect(screen.queryByText('ada@example.com')).toBeNull();
    expect(screen.queryByText(/member since/i)).toBeNull();
    expect(screen.queryByText(/most successful products/i)).toBeNull();
  });

  it('navigates from deterministic attention actions', () => {
    render(<CreatorDashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'Add media' }));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/app/products/edit/prod-membership-lab',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reconnect' }));
    expect(mockNavigate).toHaveBeenCalledWith('/app/settings?tab=calendar');

    fireEvent.click(screen.getByRole('button', { name: 'Review drafts' }));

    expect(mockNavigate).toHaveBeenCalledWith('/app/products');
  });

  it('links only metrics with meaningful destinations', () => {
    render(<CreatorDashboard />);

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

  it('links top products to their product workspaces', () => {
    render(<CreatorDashboard />);

    expect(
      screen.getByRole('link', { name: /edit creator product growth system/i }),
    ).toHaveAttribute('href', '/app/products/edit/prod-course-growth');
    expect(screen.getByRole('link', { name: /edit launch toolkit/i })).toHaveAttribute(
      'href',
      '/app/products/edit/prod-launch-toolkit',
    );
  });

  it('keeps activity navigation specific to meaningful existing destinations', () => {
    render(<CreatorDashboard />);

    expect(
      screen.getByRole('link', { name: /open product updated: launch toolkit/i }),
    ).toHaveAttribute('href', '/app/products/edit/prod-launch-toolkit');
    expect(screen.queryByRole('link', { name: /open new sale/i })).toBeNull();
    expect(
      screen.queryByRole('link', { name: /open membership started/i }),
    ).toBeNull();
    expect(screen.queryByRole('link', { name: /open payment failed/i })).toBeNull();
  });

  it('uses honest unavailable states when inspection mocks are off', () => {
    process.env.REACT_APP_USE_MOCKS = 'false';

    render(<CreatorDashboard />);

    expect(screen.getAllByText('Unavailable')).toHaveLength(4);
    expect(
      screen.getByText(/activity will appear here once business events are available/i),
    ).toBeInTheDocument();
  });

  it('renders the shared dashboard boundary for non-creators', () => {
    mockedUseSelector.mockImplementation((selector: any) => {
      if (selector === selectAuthUser) {
        return {
          id: 'user-1',
          firstName: 'Normal',
          lastName: 'User',
          email: 'normal@example.com',
          roles: [UserRole.USER],
        };
      }
      return undefined;
    });

    render(<CreatorDashboard />);

    expect(
      screen.getByText(/creator business tools are available/i),
    ).toBeInTheDocument();
    expect(mockedGetProductSummariesByOwner).not.toHaveBeenCalled();
    expect(mockedGetAllProductsByUserId).not.toHaveBeenCalled();
  });
});
