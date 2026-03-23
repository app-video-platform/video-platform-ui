import {
  uploadDownloadSectionFileAPI,
} from 'core/api/services';

export const uploadFileToSection = async (
  productId: string,
  sectionId: string,
  file: File,
) => {
  try {
    return await uploadDownloadSectionFileAPI({
      productId,
      sectionId,
      file,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('uploadFileToSection failed:', error);
    throw error;
  }
};
