/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';

import StatusBadge from './status-badge.component';

describe('<StatusBadge />', () => {
  it('renders visible status text and semantic tone class', () => {
    render(<StatusBadge label="Paid" tone="success" />);

    expect(screen.getByText('Paid')).toBeVisible();
    expect(screen.getByText('Paid').closest('.status-badge')).toHaveClass(
      'status-badge--success',
    );
  });
});
