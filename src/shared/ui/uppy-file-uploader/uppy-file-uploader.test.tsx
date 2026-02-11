/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import UppyFileUploader from './uppy-file-uploader.component';
import Uppy from '@uppy/core';
import '@testing-library/jest-dom';

jest.mock('@uppy/thumbnail-generator', () => jest.fn());
jest.mock('@uppy/google-drive', () => jest.fn());
jest.mock('@uppy/dropbox', () => jest.fn());
jest.mock('@uppy/onedrive', () => jest.fn());
jest.mock('@uppy/unsplash', () => jest.fn());
jest.mock('@uppy/url', () => jest.fn());
jest.mock('@uppy/xhr-upload', () => jest.fn());

// Mock Uppy to return a dummy instance that we control.
jest.mock('@uppy/core', () =>
  jest.fn().mockImplementation(() => ({
    use: jest.fn(),
    on: jest.fn(),
    getFiles: jest.fn(() => []),
    close: jest.fn(),
  })),
);

// Mock the Dashboard component from @uppy/react so we can verify its props.
jest.mock('@uppy/react', () => ({
  Dashboard: (props: any) => (
    <div data-testid="dashboard">{JSON.stringify(props)}</div>
  ),
}));

describe('UppyFileUploader component', () => {
  let mockOnFilesChange: jest.Mock;
  let mockUppyInstance: any;

  beforeEach(() => {
    mockOnFilesChange = jest.fn();
    // Clear any previous mock implementations
    (Uppy as unknown as jest.Mock).mockClear();

    // Create our controlled mock Uppy instance.
    mockUppyInstance = {
      use: jest.fn(),
      on: jest.fn(),
      getFiles: jest.fn(() => [{ data: { name: 'file1.mp4' } }]),
      // Add the destroy method to the mock instance
      destroy: jest.fn(),
      close: jest.fn(),
    };

    // Ensure that whenever Uppy is instantiated, we return our mock instance.
    (Uppy as unknown as jest.Mock).mockImplementation(() => mockUppyInstance);
  });

  it('renders the Dashboard component with the correct props', () => {
    render(<UppyFileUploader onFilesChange={mockOnFilesChange} />);
    // Our mocked Dashboard renders a div with data-testid="dashboard"
    const dashboard = screen.getByTestId('dashboard');
    expect(dashboard).toBeInTheDocument();

    // Parse the props that Dashboard was given.
    const dashboardProps = JSON.parse(dashboard.textContent || '{}');
    expect(dashboardProps.plugins).toEqual([
      'GoogleDrive',
      'Dropbox',
      'OneDrive',
      'Url',
      'Unsplash',
    ]);
    expect(dashboardProps.proudlyDisplayPoweredByUppy).toBe(true);
  });

  it('registers event listeners for file-added and file-removed', () => {
    render(<UppyFileUploader onFilesChange={mockOnFilesChange} />);
    // Verify that our uppy instance registered "file-added" and "file-removed" event listeners.
    expect(mockUppyInstance.on).toHaveBeenCalledWith(
      'file-added',
      expect.any(Function),
    );
    expect(mockUppyInstance.on).toHaveBeenCalledWith(
      'file-removed',
      expect.any(Function),
    );
  });

  it('calls onFilesChange when a file is added', () => {
    render(<UppyFileUploader onFilesChange={mockOnFilesChange} />);
    // Retrieve the callback that was registered for "file-added"
    const fileAddedCallback = mockUppyInstance.on.mock.calls.find(
      (call: any) => call[0] === 'file-added',
    )?.[1];
    expect(fileAddedCallback).toBeDefined();
    // Simulate a file being added.
    act(() => {
      fileAddedCallback({ data: { name: 'file1.mp4' } });
    });
    // onFilesChange should be called with the files returned by getFiles()
    expect(mockOnFilesChange).toHaveBeenCalledWith([{ name: 'file1.mp4' }]);
  });

  it('calls onFilesChange when a file is removed', () => {
    render(<UppyFileUploader onFilesChange={mockOnFilesChange} />);
    // Retrieve the callback for "file-removed"
    const fileRemovedCallback = mockUppyInstance.on.mock.calls.find(
      (call: any) => call[0] === 'file-removed',
    )?.[1];
    expect(fileRemovedCallback).toBeDefined();
    // Simulate a file removal.
    act(() => {
      fileRemovedCallback();
    });
    expect(mockOnFilesChange).toHaveBeenCalledWith([{ name: 'file1.mp4' }]);
  });
});
