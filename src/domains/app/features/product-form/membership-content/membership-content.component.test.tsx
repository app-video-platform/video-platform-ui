import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('core/store/product-store', () => ({
  __esModule: true,
  getProductSummariesByOwner: jest.fn(),
  selectProductSummaries: jest.fn((state) => state.products.productSummaries),
  selectProductsLoading: jest.fn((state) => state.products.loading),
  selectProductsError: jest.fn((state) => state.products.error),
}));

import { useDispatch, useSelector } from 'react-redux';
import { ProductMinimised } from 'core/api/models';
import MembershipContentSection from './membership-content.component';

const productSummaries: ProductMinimised[] = [
  {
    id: 'course-1',
    title: 'Course One',
    description: 'A full course',
    type: 'COURSE',
    status: 'DRAFT',
  },
  {
    id: 'download-1',
    title: 'Download Kit',
    type: 'DOWNLOAD',
    status: 'PUBLISHED',
  },
  {
    id: 'consultation-1',
    title: 'Consulting Call',
    type: 'CONSULTATION',
    status: 'DRAFT',
  },
];

const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;

const renderMembershipContent = () => {
  mockedUseDispatch.mockReturnValue(jest.fn() as never);
  mockedUseSelector.mockImplementation((selector) =>
    selector({
      products: {
        productSummaries,
        loading: false,
        error: null,
      },
    } as never),
  );

  render(
    <MembershipContentSection
      ownerId="creator-1"
      currentProductId="membership-1"
    />,
  );
};

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('<MembershipContentSection />', () => {
  it('+ Add Content opens the chooser', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));

    expect(screen.getByRole('button', { name: /Video/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Existing Product/i }),
    ).toBeInTheDocument();
  });

  it('selecting Post switches to POST creation mode', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));

    expect(screen.getByText('Creating Post')).toBeInTheDocument();
    expect(screen.getByText('Post editor coming next.')).toBeInTheDocument();
  });

  it('selecting Video switches to VIDEO creation mode', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Video/i }));

    expect(screen.getByText('Creating Video')).toBeInTheDocument();
    expect(screen.getByText('Video editor coming next.')).toBeInTheDocument();
  });

  it('selecting Resource switches to RESOURCE creation mode', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Resource/i }));

    expect(screen.getByText('Creating Resource')).toBeInTheDocument();
    expect(screen.getByText('Resource editor coming next.')).toBeInTheDocument();
  });

  it('cancelling native creation returns to the content list', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByText('Creating Post')).not.toBeInTheDocument();
    expect(screen.getByText('No membership content yet.')).toBeInTheDocument();
  });

  it('selecting Existing Product opens the current ProductPicker flow', () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Existing Product/i }));

    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Course One')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Download Kit')).toBeInTheDocument();
    expect(screen.queryByText('Consulting Call')).not.toBeInTheDocument();
  });

  it('chooser does not alter existing included products', async () => {
    renderMembershipContent();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Existing Product/i }));
    fireEvent.click(screen.getByLabelText('Select Course One'));
    fireEvent.click(screen.getByRole('button', { name: 'Add selected' }));

    await waitFor(() => {
      expect(screen.getByText('Course One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '+ Add Content' }));
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Course One')).toBeInTheDocument();
  });

  it('content list renders normally when no creation mode is active', () => {
    renderMembershipContent();

    expect(screen.getByText('Membership Content')).toBeInTheDocument();
    expect(screen.getByText('No membership content yet.')).toBeInTheDocument();
    expect(screen.queryByText(/editor coming next/i)).not.toBeInTheDocument();
  });
});
