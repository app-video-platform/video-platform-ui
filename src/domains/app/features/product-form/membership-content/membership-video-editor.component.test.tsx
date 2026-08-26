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
            new File(['video'], 'member-video.mp4', { type: 'video/mp4' }),
          ])
        }
      >
        Select video file
      </button>
    ),
  };
});

import MembershipVideoEditor from './membership-video-editor.component';
import { MembershipVideoDraft } from './models';

const draft: MembershipVideoDraft = {
  title: 'Weekly video',
  description: 'A private video update.',
  status: 'DRAFT',
  video: {
    fileName: 'weekly-video.mp4',
    fileType: 'video/mp4',
    size: 4096,
  },
};

const renderEditor = (value: MembershipVideoDraft = draft) => {
  const onChange = jest.fn();
  const onSave = jest.fn();
  const onCancel = jest.fn();

  render(
    <MembershipVideoEditor
      value={value}
      onChange={onChange}
      onSave={onSave}
      onCancel={onCancel}
    />,
  );

  return { onChange, onSave, onCancel };
};

describe('<MembershipVideoEditor />', () => {
  it('renders title', () => {
    renderEditor();

    expect(screen.getByDisplayValue('Weekly video')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderEditor();

    expect(screen.getByDisplayValue('A private video update.')).toBeInTheDocument();
  });

  it('renders video selector', () => {
    renderEditor();

    expect(
      screen.getByRole('button', { name: 'Select video file' }),
    ).toBeInTheDocument();
  });

  it('default status is DRAFT', () => {
    renderEditor({
      title: '',
      description: '',
      status: 'DRAFT',
      video: null,
    });

    expect(screen.getByLabelText('Status')).toHaveValue('DRAFT');
  });

  it('requires title before saving', () => {
    const { onSave } = renderEditor({
      ...draft,
      title: '  ',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Enter a video title.')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('requires video before saving', () => {
    const { onSave } = renderEditor({
      ...draft,
      video: null,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Select a video file.')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('selecting a video updates the controlled draft', () => {
    const { onChange } = renderEditor({
      title: 'Draft video',
      description: '',
      status: 'DRAFT',
      video: null,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Select video file' }));

    expect(onChange).toHaveBeenCalledWith({
      title: 'Draft video',
      description: '',
      status: 'DRAFT',
      video: {
        fileName: 'member-video.mp4',
        fileType: 'video/mp4',
        size: 5,
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

  it('valid Video can be saved', () => {
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
