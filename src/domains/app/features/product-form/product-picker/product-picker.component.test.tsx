import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ProductMinimised, ProductType } from 'core/api/models';
import ProductPicker from './product-picker.component';

const products: ProductMinimised[] = [
  {
    id: 'course-1',
    title: 'Course One',
    description: 'A full course',
    type: 'COURSE',
    status: 'DRAFT',
    price: 10,
  },
  {
    id: 'download-1',
    title: 'Download Kit',
    description: 'A downloadable bundle',
    type: 'DOWNLOAD',
    status: 'PUBLISHED',
    price: 'free',
  },
  {
    id: 'membership-1',
    title: 'Membership Plan',
    type: 'MEMBERSHIP',
    status: 'DRAFT',
  },
  {
    id: 'consultation-1',
    title: 'Strategy Call',
    type: 'CONSULTATION',
    status: 'PUBLISHED',
  },
  {
    id: 'excluded-1',
    title: 'Already Added',
    type: 'COURSE',
    status: 'DRAFT',
  },
];

const renderPicker = (overrides = {}) => {
  const props = {
    products,
    selectedIds: [],
    allowedTypes: ['COURSE', 'DOWNLOAD'] as ProductType[],
    excludedIds: [],
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    ...overrides,
  };

  render(<ProductPicker {...props} />);

  return props;
};

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('<ProductPicker />', () => {
  it('renders only eligible products for the allowed types', () => {
    renderPicker();

    expect(screen.getByText('Course One')).toBeInTheDocument();
    expect(screen.getByText('Download Kit')).toBeInTheDocument();
    expect(screen.queryByText('Membership Plan')).not.toBeInTheDocument();
    expect(screen.queryByText('Strategy Call')).not.toBeInTheDocument();
  });

  it('excludes products by id', () => {
    renderPicker({ excludedIds: ['excluded-1'] });

    expect(screen.queryByText('Already Added')).not.toBeInTheDocument();
  });

  it('filters visible products by search query', () => {
    renderPicker();

    fireEvent.change(screen.getByPlaceholderText('Search products...'), {
      target: { value: 'download' },
    });

    expect(screen.queryByText('Course One')).not.toBeInTheDocument();
    expect(screen.getByText('Download Kit')).toBeInTheDocument();
  });

  it('confirms the temporary checkbox selection', () => {
    const { onConfirm } = renderPicker();

    fireEvent.click(screen.getByLabelText('Select Course One'));
    fireEvent.click(screen.getByRole('button', { name: 'Add selected' }));

    expect(onConfirm).toHaveBeenCalledWith(['course-1']);
  });

  it('cancels without confirming the temporary selection', () => {
    const { onCancel, onConfirm } = renderPicker();

    fireEvent.click(screen.getByLabelText('Select Course One'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('disables confirmation until at least one product is selected', () => {
    renderPicker();

    expect(screen.getByRole('button', { name: 'Add selected' })).toBeDisabled();
  });
});
