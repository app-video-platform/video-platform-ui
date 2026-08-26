import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductWorkspaceShell from './product-workspace-shell.component';

jest.mock('@shared/ui', () => {
  const actual = jest.requireActual('@shared/ui');

  return {
    __esModule: true,
    ...actual,
    Icon: () => <span data-testid="icon" />,
  };
});

jest.mock('react-icons/hi', () => ({
  __esModule: true,
  HiArrowLeft: () => <svg aria-hidden="true" />,
  HiDotsVertical: () => <svg aria-hidden="true" />,
}));

jest.mock('react-icons/fi', () => ({
  __esModule: true,
  FiExternalLink: () => <svg aria-hidden="true" />,
}));

const renderShell = (
  overrides: Partial<React.ComponentProps<typeof ProductWorkspaceShell>> = {},
) =>
  render(
    <MemoryRouter>
      <ProductWorkspaceShell
        productType="COURSE"
        productTitle="Course One"
        productStatus="DRAFT"
        isEditMode
        showWorkspace
        saveStatus="idle"
        navigation={<button type="button">Basics</button>}
        {...overrides}
      >
        <div>Workspace content</div>
      </ProductWorkspaceShell>
    </MemoryRouter>,
  );

describe('<ProductWorkspaceShell />', () => {
  it('renders Product identity and lifecycle status', () => {
    renderShell({ productStatus: 'PUBLISHED' });

    expect(screen.getByRole('heading', { name: 'Course One' })).toBeInTheDocument();
    expect(screen.getByText('Course')).toBeInTheDocument();
    expect(screen.getAllByText('Published')).toHaveLength(2);
  });

  it('shows pending autosave feedback accessibly', () => {
    renderShell({ hasPendingAutosave: true });

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });

  it('wires Preview and Publish actions without requiring form submission', () => {
    const onPreview = jest.fn();
    const onPublish = jest.fn();

    renderShell({
      canPreview: true,
      onPreview,
      onPublish,
    });

    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    fireEvent.click(screen.getByRole('button', { name: /publish/i }));

    expect(onPreview).toHaveBeenCalled();
    expect(onPublish).toHaveBeenCalled();
  });

  it('explains backend-pending Preview when disabled', () => {
    renderShell({
      canPreview: false,
      previewDisabledReason: 'Creator-only preview is backend-pending.',
    });

    expect(screen.getByRole('button', { name: /preview/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /preview/i })).toHaveAttribute(
      'title',
      'Creator-only preview is backend-pending.',
    );
  });
});
