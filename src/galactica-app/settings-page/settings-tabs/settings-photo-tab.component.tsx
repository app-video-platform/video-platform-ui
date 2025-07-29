import React from 'react';
import { useSelector } from 'react-redux';

import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
import GalUppyFileUploader from '../../../components/gal-uppy-file-uploader/gal-uppy-file-uploader.component';

const SettingsPhotoTab: React.FC = () => {
  const user = useSelector(selectAuthUser);

  const onFileUpload = (e: any) => {
    console.log('uploaded thing', e);
  };

  return (
    <div>
      <h2>Public Profile Picture</h2>
      <h4>Add a photo of yourself</h4>
      <GalUppyFileUploader maxNumberOfFiles={1} onFilesChange={onFileUpload} />
    </div>
  );
};

export default SettingsPhotoTab;
