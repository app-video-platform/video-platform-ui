import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector } from 'react-redux';

import ProductHeader from './product-header.component';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../hooks', () => ({
  useGlobalSaveStatus: jest.fn(() => 'idle'),
}));

describe('<ProductHeader />', () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows CREATE NEW PRODUCT in create mode', () => {
    render(
      <ProductHeader
        formData={{ type: 'COURSE', name: '' } as any}
        isEditMode={false}
        showRestOfForm={false}
        hasHeroCollapsed={false}
        headerRef={undefined}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'CREATE NEW PRODUCT' }),
    ).toBeInTheDocument();
  });

  it('shows EDIT PRODUCT in edit mode', () => {
    render(
      <ProductHeader
        formData={{ type: 'COURSE', name: '' } as any}
        isEditMode={true}
        showRestOfForm={false}
        hasHeroCollapsed={false}
        headerRef={undefined}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'EDIT PRODUCT' }),
    ).toBeInTheDocument();
  });
});
