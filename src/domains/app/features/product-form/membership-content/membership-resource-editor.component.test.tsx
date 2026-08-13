import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@shared/ui', () => {
  const actual = jest.requireActual('@shared/ui');
  type MockUploaderProps = {
    // eslint-disable-next-line no-unused-vars
    onFilesChange?: (files: File[]) => void;
  };

  return {
    __esModule: true,
    ...actual,
    UppyFileUploader: ({
      onFilesChange,
    }: MockUploaderProps) => (
      <button
        type="button"
        onClick={() =>
          onFilesChange?.([
            new File(['resource'], 'member-resource.pdf', {
              type: 'application/pdf',
            }),
          ])
        }
      >
        Select resource file
      </button>
    ),
  };
});

import MembershipResourceEditor from './membership-resource-editor.component';
import { MembershipResourceDraft } from './models';

const draft: MembershipResourceDraft = {
  title: 'Weekly resource',
  description: 'A private worksheet.',
  status: 'DRAFT',
  file: {
    fileName: 'weekly-resource.pdf',
    fileType: 'application/pdf',
    size: 8192,
  },
};

const renderEditor = (value: MembershipResourceDraft = draft) => {
  const onChange = jest.fn();
  const onSave = jest.fn();
  const onCancel = jest.fn();

  render(
    <MembershipResourceEditor
      value={value}
      onChange={onChange}
      onSave={onSave}
      onCancel={onCancel}
    />,
  );

  return { onChange, onSave, onCancel };
};

describe('<MembershipResourceEditor />', () => {
  it('renders title', () => {
    renderEditor();

    expect(screen.getByDisplayValue('Weekly resource')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderEditor();

    expect(screen.getByDisplayValue('A private worksheet.')).toBeInTheDocument();
  });

  it('renders file selector', () => {
    renderEditor();

    expect(
      screen.getByRole('button', { name: 'Select resource file' }),
    ).toBeInTheDocument();
  });

  it('default status is DRAFT', () => {
    renderEditor({
      title: '',
      description: '',
      status: 'DRAFT',
      file: null,
    });

    expect(screen.getByLabelText('Status')).toHaveValue('DRAFT');
  });

  it('requires title before saving', () => {
    const { onSave } = renderEditor({
      ...draft,
      title: '  ',
    });

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).not.toHaveBeenCalled();
  });

  it('requires file before saving', () => {
    const { onSave } = renderEditor({
      ...draft,
      file: null,
    });

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).not.toHaveBeenCalled();
  });

  it('selecting a file updates the controlled draft', () => {
    const { onChange } = renderEditor({
      title: 'Draft resource',
      description: '',
      status: 'DRAFT',
      file: null,
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Select resource file' }),
    );

    expect(onChange).toHaveBeenCalledWith({
      title: 'Draft resource',
      description: '',
      status: 'DRAFT',
      file: {
        fileName: 'member-resource.pdf',
        fileType: 'application/pdf',
        size: 8,
      },
    });
  });

  it('changing status preserves other values', () => {
    const { onChange } = renderEditor();

    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'PUBLISHED' },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...draft,
      status: 'PUBLISHED',
    });
  });

  it('valid Resource can be saved', () => {
    const { onSave } = renderEditor();

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('Cancel works', () => {
    const { onCancel } = renderEditor();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
