import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import BasicInfo from './basic-info.component';

jest.mock('@shared/ui', () => ({
  __esModule: true,
  Input: ({
    label,
    name,
    value,
    error,
    onChange,
  }: {
    label?: string;
    name?: string;
    value?: string;
    error?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <label>
      {label}
      <input
        data-testid={`input-${name}`}
        value={value ?? ''}
        aria-invalid={Boolean(error)}
        onChange={onChange}
      />
      {error && <span>{error}</span>}
    </label>
  ),
  Textarea: ({
    label,
    name,
    value,
    onChange,
  }: {
    label?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }) => (
    <label>
      {label}
      <textarea
        data-testid={`textarea-${name}`}
        value={value ?? ''}
        onChange={onChange}
      />
    </label>
  ),
}));

describe('<BasicInfo />', () => {
  it('renders Product name, description, and type context', () => {
    render(
      <BasicInfo
        formData={
          {
            type: 'COURSE',
            name: 'How to cook',
            description: 'desc',
          } as any
        }
        setField={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Course name')).toHaveValue('How to cook');
    expect(screen.getByLabelText('Course description')).toHaveValue('desc');
    expect(screen.getByText('Course')).toBeInTheDocument();
    expect(screen.getByText('Read-only')).toBeInTheDocument();
  });

  it('updates name and description through setField', () => {
    const setField = jest.fn();

    render(
      <BasicInfo
        formData={
          {
            type: 'COURSE',
            name: 'How to cook',
            description: 'desc',
          } as any
        }
        setField={setField}
      />,
    );

    fireEvent.change(screen.getByLabelText('Course name'), {
      target: { value: 'New name' },
    });
    fireEvent.change(screen.getByLabelText('Course description'), {
      target: { value: 'New description' },
    });

    expect(setField).toHaveBeenCalledWith('name', 'New name');
    expect(setField).toHaveBeenCalledWith('description', 'New description');
  });

  it('does not expose Product type switching in edit mode', () => {
    const setField = jest.fn();

    render(
      <BasicInfo
        formData={
          {
            type: 'DOWNLOAD',
            name: 'Asset pack',
            description: 'desc',
          } as any
        }
        setField={setField}
      />,
    );

    expect(screen.queryByTestId('product-type-selector')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /course/i })).not
      .toBeInTheDocument();
    expect(setField).not.toHaveBeenCalledWith('type', expect.anything());
  });

  it.each([
    ['COURSE', 'Course name'],
    ['DOWNLOAD', 'Download name'],
    ['CONSULTATION', 'Consultation name'],
    ['MEMBERSHIP', 'Membership name'],
  ])('uses shared type-aware copy for %s', (type, label) => {
    render(
      <BasicInfo
        formData={
          {
            type,
            name: 'Product',
            description: '',
          } as any
        }
        setField={jest.fn()}
      />,
    );

    expect(screen.getByLabelText(label)).toBeInTheDocument();
  });

  it('shows field validation without treating backend errors as field errors', () => {
    render(
      <BasicInfo
        formData={
          {
            type: 'COURSE',
            name: '',
            description: '',
          } as any
        }
        errors={{
          name: 'Product name is required.',
          api: 'Autosave failed.',
        }}
        setField={jest.fn()}
      />,
    );

    expect(screen.getByText('Product name is required.')).toBeInTheDocument();
    expect(screen.queryByText('Autosave failed.')).not.toBeInTheDocument();
  });
});
