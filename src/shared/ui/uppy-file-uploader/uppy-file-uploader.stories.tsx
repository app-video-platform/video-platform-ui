import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5'; // or '@storybook/react-vite'
import { useState } from 'react';
import UppyFileUploader from './uppy-file-uploader.component';

const meta: Meta<typeof UppyFileUploader> = {
  title: 'Components/UppyFileUploader',
  component: UppyFileUploader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Preconfigured Uppy Dashboard with XHR upload and optional cloud importers. Emits a list of native Files via `onFilesChange`.',
      },
    },
  },
  argTypes: {
    allowedFileTypes: {
      control: 'object',
      description: 'Accepted MIME patterns (e.g., ["image/*"])',
    },
    maxNumberOfFiles: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'Maximum number of files',
    },
    maxFileSize: {
      control: { type: 'number' },
      description: 'Max file size in bytes',
    },
    disableImporters: {
      control: 'boolean',
      description:
        'Disable Google Drive/Dropbox/OneDrive/URL/Unsplash importers',
    },
    onFilesChange: { action: 'filesChanged' },
  },
};

export default meta;
type Story = StoryObj<typeof UppyFileUploader>;

export const ImagesOnly: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div style={{ width: 640 }}>
        <UppyFileUploader
          {...args}
          onFilesChange={(f) => {
            setFiles(f);
            args.onFilesChange?.(f);
          }}
        />
        <div
          style={{
            marginTop: '1rem',
            background: '#f7f7f7',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            fontSize: 13,
            color: '#333',
          }}
        >
          <strong>Files ({files.length}):</strong>
          <ul style={{ margin: '0.5rem 0 0' }}>
            {files.map((f, i) => (
              <li key={i}>
                {f.name} — {(f.size / 1024).toFixed(1)} KB
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
  args: {
    allowedFileTypes: ['image/*'],
    maxNumberOfFiles: 5,
    maxFileSize: 5 * 1024 * 1024,
    disableImporters: true, // keep true in Storybook to avoid Companion popups
  },
  parameters: {
    docs: {
      description: {
        story:
          // eslint-disable-next-line max-len
          'Image-only configuration with importers disabled (safer in Storybook). Drag & drop or browse to add files; the selected list updates below.',
      },
    },
  },
};

export const WithImporters: Story = {
  render: (args) => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div style={{ width: 720 }}>
        <UppyFileUploader
          {...args}
          onFilesChange={(f) => {
            setFiles(f);
            args.onFilesChange?.(f);
          }}
        />
        <p style={{ marginTop: 12, color: '#555', fontSize: 13 }}>
          Importers enabled. These use the public Companion at
          https://companion.uppy.io.
        </p>
      </div>
    );
  },
  args: {
    allowedFileTypes: ['video/*', 'audio/*', 'text/*'],
    maxNumberOfFiles: 10,
    maxFileSize: 20 * 1024 * 1024,
    disableImporters: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows Google Drive / Dropbox / OneDrive / URL / Unsplash importers. Useful for demos; in production, consider self-hosting Companion.',
      },
    },
  },
};
