import { useSelector } from 'react-redux';
import { addFileToSectionAPI } from '../api/products-api';
import { IFilesWithSection } from '../galactica-app/products/create-product/create-product.component';
import { addNotification } from '../store/auth-store/auth.slice';
import { selectNotifications } from '../store/auth-store/auth.selectors';

export const uploadFilesInBackground = async (
  filesWithSection: IFilesWithSection[],
  productData: { id: string; sections: { id: string; position: number }[] },
  dispatch: any  // or your specific type for dispatch
) => {
  // Create an array to hold the upload promises
  const notifications = useSelector(selectNotifications);
  const uploadPromises: any[] = [];

  filesWithSection.forEach(filesWithSection => {
    // Find the corresponding section using the sectionId (here assumed to be the section's position as string)
    const foundSection = productData.sections.find(
      section => section.position.toString() === filesWithSection.sectionId
    );
    if (foundSection) {
      // For each file in the files array, fire off an upload request
      filesWithSection.files.forEach(file => {
        // Wrap the upload call in a promise.
        // This example assumes addFileToSectionAPI returns a promise.
        const uploadPromise = addFileToSectionAPI(file, foundSection.id);
        uploadPromises.push(uploadPromise);
      });
    }
  });

  // Wait for all promises to settle (either fulfilled or rejected)
  const results = await Promise.allSettled(uploadPromises);

  // Check results and prepare a final notification message
  const failedUploads = results.filter(result => result.status === 'rejected');
  let message = '';
  if (failedUploads.length > 0) {
    message = `Some files failed to upload (${failedUploads.length} error/s).`;
  } else {
    message = 'All files uploaded successfully!';
  }
  // Dispatch a notification action (or call a function to update auth state notifications)
  dispatch(addNotification({
    message,
    type: failedUploads.length > 0 ? 'ERROR' : 'SUCCESS',
    title: failedUploads.length > 0 ? 'ERROR' : 'SUCCESS',
    id: notifications.length + 1,
    isRead: false
  }));

  return results;
};
