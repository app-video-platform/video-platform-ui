import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('renders one radio control per Product type', () => {
    render(<ProductTypeSelector value="COURSE" onChange={jest.fn()} />);

    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  it('supports keyboard selection through the same Product type state', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const ControlledSelector = () => {
      const [value, setValue] = React.useState<'COURSE' | 'DOWNLOAD' | 'MEMBERSHIP'>(
        'COURSE',
      );

      return (
        <ProductTypeSelector
          value={value}
          onChange={(type) => {
            onChange(type);
            setValue(type as 'COURSE' | 'DOWNLOAD' | 'MEMBERSHIP');
          }}
        />
      );
    };

    render(<ControlledSelector />);

    const course = screen.getByRole('radio', { name: /course/i });
    course.focus();

    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('DOWNLOAD');
    expect(screen.getByRole('radio', { name: /download/i }))
      .toHaveAttribute('aria-checked', 'true');

    screen.getByRole('radio', { name: /membership/i }).focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith('MEMBERSHIP');
    expect(screen.getByRole('radio', { name: /membership/i }))
      .toHaveAttribute('aria-checked', 'true');
  });
});
