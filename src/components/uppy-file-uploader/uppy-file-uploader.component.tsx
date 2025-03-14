import React, { useEffect } from 'react';
import Uppy, { Uppy as UppyType } from '@uppy/core';
import { Dashboard } from '@uppy/react';
import GoogleDrive from '@uppy/google-drive';
import Dropbox from '@uppy/dropbox';
import OneDrive from '@uppy/onedrive';
import Unsplash from '@uppy/unsplash';
import Url from '@uppy/url';
import XHRUpload from '@uppy/xhr-upload';

// Import default Uppy styles (you can override these with custom CSS)
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import './uppy-file-uploader.styles.scss';

interface UppyFileUploaderProps {
  onFilesChange: (files: File[]) => void;
}

const UppyFileUploader: React.FC<UppyFileUploaderProps> = ({ onFilesChange }) => {
  // Initialize Uppy with restrictions to only accept video, audio, and text files
  const uppy: UppyType<any, any> = new Uppy({
    restrictions: {
      maxNumberOfFiles: 10,
      allowedFileTypes: ['video/*', 'audio/*', 'text/*'],
      maxFileSize: 100 * 1024 * 1024, // 100 MB in bytes
    },
    autoProceed: false,
  });

  // Use XHRUpload plugin to handle file uploads (replace '/upload' with your endpoint)
  uppy.use(XHRUpload, {
    endpoint: '/upload',
    fieldName: 'file',
  });

  // Integrate third-party file sources using Uppy plugins with the default Companion service
  uppy.use(GoogleDrive, { companionUrl: 'https://companion.uppy.io' });
  uppy.use(Dropbox, { companionUrl: 'https://companion.uppy.io' });
  uppy.use(OneDrive, { companionUrl: 'https://companion.uppy.io' });
  uppy.use(Url, { companionUrl: 'https://companion.uppy.io' });
  uppy.use(Unsplash, { companionUrl: 'https://companion.uppy.io' });

  // Listen for changes to the file list
  uppy.on('file-added', (file) => {
    // Send the current list of files to the parent component
    onFilesChange(uppy.getFiles().map((f) => f.data as File));
  });

  uppy.on('file-removed', () => {
    onFilesChange(uppy.getFiles().map((f) => f.data as File));
  });

  // // Clean up Uppy instance when component unmounts
  // useEffect(() => () => {
  //   (uppy as any).close();
  // }, [uppy]);

  return (
    <div className="custom-uppy-dashboard">
      <Dashboard
        uppy={uppy}
        plugins={['GoogleDrive', 'Dropbox', 'OneDrive', 'Url', 'Unsplash']}
        proudlyDisplayPoweredByUppy={true}
        className='custom-uppy-dashboard'
      />
    </div>
  );
};

export default UppyFileUploader;
