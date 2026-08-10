import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

  it('disables Membership Publish and shows blockers when readiness fails', () => {
    render(
      <ProductHeader
        formData={{ type: 'MEMBERSHIP', name: 'Founders Club' } as any}
        isEditMode={true}
        showRestOfForm={true}
        hasHeroCollapsed={true}
        headerRef={undefined}
        membershipReadiness={{
          canPublish: false,
          errors: [
            {
              code: 'INVALID_RECURRING_PRICE',
              severity: 'ERROR',
              message: 'Set a valid recurring price.',
            },
            {
              code: 'NO_PUBLISHED_ENTRY',
              severity: 'ERROR',
              message:
                'Add at least one published content item or included Product.',
            },
          ],
          warnings: [],
        }}
      />,
    );

    expect(screen.getByText('Not ready to publish')).toBeInTheDocument();
    expect(screen.getByText('Set a valid recurring price.')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Publish' }),
    ).toBeDisabled();
  });

  it('keeps ready Membership Publish non-persistent and informational', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

    render(
      <ProductHeader
        formData={{ type: 'MEMBERSHIP', name: 'Founders Club' } as any}
        isEditMode={true}
        showRestOfForm={true}
        hasHeroCollapsed={true}
        headerRef={undefined}
        membershipReadiness={{
          canPublish: true,
          errors: [],
          warnings: [
            {
              code: 'NO_INCLUDED_PRODUCTS',
              severity: 'WARNING',
              message: 'This Membership has no included Products.',
            },
          ],
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Publish' }));

    expect(alertSpy).toHaveBeenCalledWith(
      'Membership publishing will be enabled once Membership persistence is available.',
    );

    alertSpy.mockRestore();
  });

  it('leaves non-Membership Publish rendering on the existing path', () => {
    render(
      <ProductHeader
        formData={{ type: 'COURSE', name: 'Course' } as any}
        isEditMode={true}
        showRestOfForm={true}
        hasHeroCollapsed={true}
        headerRef={undefined}
      />,
    );

    expect(screen.queryByText('Ready to publish')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Publish' }),
    ).not.toBeDisabled();
  });
});
