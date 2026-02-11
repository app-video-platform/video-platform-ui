import {
  getPresignedUrlAPI,
  uploadToPresignedUrl,
  confirmFileUploadAPI,
} from '@api/services';

export const uploadFileToSection = async (sectionId: string, file: File) => {
  try {
    // Step 1: Get presigned URL from your backend
    const { presignedUrl, key, fileUrl } = await getPresignedUrlAPI(
      sectionId,
      file.name,
    );

    // Step 2: Upload to storage using the presigned URL
    await uploadToPresignedUrl(presignedUrl, file);

    // Step 3: Confirm the upload with your backend
    const result = await confirmFileUploadAPI({
      sectionId,
      key,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('uploadFileToSection failed:', error);
    throw error;
  }
};
