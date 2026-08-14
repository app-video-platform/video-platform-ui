import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductTypeSelector from './product-type-selector.component';

describe('<ProductTypeSelector />', () => {
  it('shows Membership as a create option from the registry', () => {
    render(<ProductTypeSelector value="COURSE" onChange={jest.fn()} />);

    expect(screen.getByRole('radio', { name: /membership/i })).toBeInTheDocument();
    expect(
      screen.getByText('Community access, member updates, and ongoing value'),
    ).toBeInTheDocument();
  });
});
