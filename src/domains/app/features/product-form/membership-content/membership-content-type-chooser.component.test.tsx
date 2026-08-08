import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import MembershipContentTypeChooser from './membership-content-type-chooser.component';

const renderChooser = () => {
  const onSelect = jest.fn();
  const onCancel = jest.fn();

  render(
    <MembershipContentTypeChooser
      onSelect={onSelect}
      onCancel={onCancel}
    />,
  );

  return { onSelect, onCancel };
};

describe('<MembershipContentTypeChooser />', () => {
  it('renders all four options', () => {
    renderChooser();

    expect(screen.getByRole('button', { name: /Video/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Post/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Resource/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Existing Product/i }),
    ).toBeInTheDocument();
  });

  it('selecting Video calls the callback with VIDEO', () => {
    const { onSelect } = renderChooser();

    fireEvent.click(screen.getByRole('button', { name: /Video/i }));

    expect(onSelect).toHaveBeenCalledWith('VIDEO');
  });

  it('selecting Post calls the callback with POST', () => {
    const { onSelect } = renderChooser();

    fireEvent.click(screen.getByRole('button', { name: /Post/i }));

    expect(onSelect).toHaveBeenCalledWith('POST');
  });

  it('selecting Resource calls the callback with RESOURCE', () => {
    const { onSelect } = renderChooser();

    fireEvent.click(screen.getByRole('button', { name: /Resource/i }));

    expect(onSelect).toHaveBeenCalledWith('RESOURCE');
  });

  it('selecting Existing Product calls the callback with EXISTING_PRODUCT', () => {
    const { onSelect } = renderChooser();

    fireEvent.click(screen.getByRole('button', { name: /Existing Product/i }));

    expect(onSelect).toHaveBeenCalledWith('EXISTING_PRODUCT');
  });

  it('Cancel closes without selection', () => {
    const { onSelect, onCancel } = renderChooser();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
