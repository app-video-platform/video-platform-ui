import { DownloadSection } from '../../api/models/product/download-section';
import { Sectiunile } from '../../api/models/product/product';
// import { Sectiunile } from '../../api/services/products/products-api';
// import { IFilesWithSection } from '../../galactica-app/products/create-product/create-product.component';
import { uploadFileToSection } from './upload-file';

interface IFilesWithSection {
  sectionLocalId: string;
  files: File[];
}

// TO BE MODIFIED for current flow

export const uploadFilesInBackground = async (
  uploadedFiles: IFilesWithSection[],
  localSections: DownloadSection[],
  savedSections: Sectiunile[]
) => {
  const localIdToBackendId = new Map<string, string>();

  for (const saved of savedSections) {
    const match = localSections.find((s) => s.position === saved.position);
    if (match?.localId && saved.id) {
      localIdToBackendId.set(match.localId, saved.id);
    }
  }

  const uploadPromises = uploadedFiles.flatMap(({ sectionLocalId, files }) => {
    const backendId = localIdToBackendId.get(sectionLocalId);
    if (!backendId) {
      return [];
    }

    return files.map((file) =>
      uploadFileToSection(backendId, file).then(
        () => ({ status: 'fulfilled', file }),
        (error) => ({ status: 'rejected', file, error })
      )
    );
  });

  const results = await Promise.all(uploadPromises);

  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length > 0) {
    // Show error toast (replace with your toast library)
    window.alert(`${failed.length} file(s) failed to upload.`);
  } else {
    window.alert('All files uploaded successfully!');
  }
};
