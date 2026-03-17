import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import BasicInfo from './basic-info.component';

jest.mock('@shared/ui', () => ({
  __esModule: true,
  Input: ({
    value,
    onChange,
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      data-testid="basic-info-title"
      value={value ?? ''}
      onChange={onChange}
    />
  ),
  Textarea: ({
    value,
    onChange,
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }) => (
    <textarea
      data-testid="basic-info-description"
      value={value ?? ''}
      onChange={onChange}
    />
  ),
}));

jest.mock('domains/app/components', () => ({
  __esModule: true,
  GalBoxSelector: ({
    availableOptions,
    onSelect,
  }: {
    availableOptions?: string[];
    onSelect: (value: any) => void;
  }) => (
    <div data-testid="product-type-selector">
      {availableOptions?.map((option) => (
        <button
          key={option}
          type="button"
          data-testid={`product-type-${option}`}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  ),
}));

describe('<BasicInfo />', () => {
  it('shows all product type options outside edit mode', () => {
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

    expect(screen.getByTestId('product-type-COURSE')).toBeInTheDocument();
    expect(screen.getByTestId('product-type-CONSULTATION')).toBeInTheDocument();
    expect(screen.getByTestId('product-type-DOWNLOAD')).toBeInTheDocument();
  });

  it('shows only the current product type option in edit mode', () => {
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
        showOnlyCurrentType
      />,
    );

    expect(screen.getByTestId('product-type-COURSE')).toBeInTheDocument();
    expect(
      screen.queryByTestId('product-type-CONSULTATION'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-type-DOWNLOAD')).not.toBeInTheDocument();
  });

  it('still routes selection through setField for the current type', () => {
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

    fireEvent.click(screen.getByTestId('product-type-DOWNLOAD'));

    expect(setField).toHaveBeenCalledWith('type', 'DOWNLOAD');
  });
});
