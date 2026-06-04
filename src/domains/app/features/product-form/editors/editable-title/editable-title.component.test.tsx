import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import EditableTitle from './editable-title.component';

describe('<EditableTitle />', () => {
  it('renders the initial value on first mount', () => {
    render(
      <EditableTitle value="Gather ingredients" onChange={jest.fn()} small />,
    );

    expect(screen.getByText('Gather ingredients')).toBeInTheDocument();
  });

  it('emits the edited value on blur', () => {
    const onChange = jest.fn();

    render(<EditableTitle value="Original" onChange={onChange} />);

    const title = screen.getByText('Original');

    title.textContent = 'Updated';
    fireEvent.blur(title);

    expect(onChange).toHaveBeenCalledWith('Updated');
  });
});
