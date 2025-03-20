import React, { useState, useEffect, useCallback } from 'react';
import Uppy, { Uppy as UppyType } from '@uppy/core';
import { Dashboard } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import ThumbnailGenerator from '@uppy/thumbnail-generator';
import GoogleDrive from '@uppy/google-drive';
import Dropbox from '@uppy/dropbox';
import OneDrive from '@uppy/onedrive';
import Url from '@uppy/url';
import Unsplash from '@uppy/unsplash';

// Import Uppy styles
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

interface UppyFileUploaderProps {
  // Callback to receive the list of native File objects
  onFilesChange?: (files: File[]) => void;
  // Allowed file types, e.g., ['image/*'] for image uploads
  allowedFileTypes?: string[];
  // Maximum number of files allowed
  maxNumberOfFiles?: number;
  // Maximum file size (in bytes)
  maxFileSize?: number;
}

const UppyFileUploader: React.FC<UppyFileUploaderProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onFilesChange = () => { },
  allowedFileTypes, // default to image uploads
  maxNumberOfFiles,
  maxFileSize = 5 * 1024 * 1024, // default to 5 MB
}) => {
  // Use state to hold the Uppy instance so that re-render occurs when it’s created
  const [uppy, setUppy] = useState<UppyType<any, any> | null>(null);
  const memoizedOnFilesChange = useCallback(onFilesChange, [onFilesChange]);

  useEffect(() => {
    // Create the Uppy instance with the provided restrictions
    const uppyInstance = new Uppy({
      restrictions: {
        maxNumberOfFiles: maxNumberOfFiles || 10,
        allowedFileTypes: allowedFileTypes || ['video/*', 'audio/*', 'text/*'],
        maxFileSize: maxFileSize || 100 * 1024 * 1024, // 100 MB in bytes
      },
      autoProceed: false,
    });

    // Configure the upload endpoint (adjust '/upload' as needed)
    uppyInstance.use(XHRUpload, {
      endpoint: '/upload',
      fieldName: 'file',
      formData: true,
    });

    // Add additional plugins with the default Companion service
    uppyInstance.use(GoogleDrive, { companionUrl: 'https://companion.uppy.io' });
    uppyInstance.use(Dropbox, { companionUrl: 'https://companion.uppy.io' });
    uppyInstance.use(OneDrive, { companionUrl: 'https://companion.uppy.io' });
    uppyInstance.use(Url, { companionUrl: 'https://companion.uppy.io' });
    uppyInstance.use(Unsplash, { companionUrl: 'https://companion.uppy.io' });

    // If image uploads are allowed, add the ThumbnailGenerator plugin
    if (allowedFileTypes && allowedFileTypes.includes('image/*')) {
      uppyInstance.use(ThumbnailGenerator, {
        thumbnailWidth: 200,
        waitForThumbnailsBeforeUpload: true,
      });
    }

    // Listen for file-added and file-removed events to update the file list
    const updateFiles = () => {
      const files: File[] = uppyInstance.getFiles().map((file) => file.data as File);
      memoizedOnFilesChange(files);
    };

    uppyInstance.on('file-added', updateFiles);
    uppyInstance.on('file-removed', updateFiles);

    // Optionally, listen for progress or thumbnail events for debugging
    uppyInstance.on('upload-progress', (file, progress) => {
      const percent = progress.bytesTotal
        ? Math.round((progress.bytesUploaded / progress.bytesTotal) * 100)
        : 0;
      console.log(`Uploading ${file?.name}: ${percent}%`);
    });
    uppyInstance.on('thumbnail:generated', (file, preview) => {
      console.log(`Thumbnail generated for ${file.name}`, preview);
    });

    // Save the instance in state so that the Dashboard renders
    setUppy(uppyInstance);

    // Cleanup on unmount
    return () => {
      // if (uppyInstance && typeof uppyInstance.destroy === 'function') {
      uppyInstance.destroy();
      // }
    };
  }, []);

  return (
    <div className="custom-uppy-dashboard">
      {uppy ? (
        <Dashboard
          uppy={uppy}
          // You can enable additional plugins in the Dashboard UI by specifying them here:
          plugins={['GoogleDrive', 'Dropbox', 'OneDrive', 'Url', 'Unsplash']}
          height={400}
          note="Images only, up to 5MB"
          hideUploadButton={true}
          proudlyDisplayPoweredByUppy={true}
        />
      ) : (
        <p>Initializing uploader...</p>
      )}
    </div>
  );
};

export default UppyFileUploader;
