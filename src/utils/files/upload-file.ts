import {
  getPresignedUrlAPI,
  uploadToPresignedUrl,
  confirmFileUploadAPI,
} from '../../api/services/products/products-api';

export const uploadFileToSection = async (sectionId: string, file: File) => {
  try {
    // Step 1: Get presigned URL from your backend
    const { fileId, presignedUrl, key, fileUrl } = await getPresignedUrlAPI(
      sectionId,
      file.name
    );

    // Step 2: Upload to storage using the presigned URL
    await uploadToPresignedUrl(presignedUrl, file);

    // Step 3: Confirm the upload with your backend
    const result = await confirmFileUploadAPI({
      sectionId,
      fileId,
      key,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    return result;
  } catch (error) {
    console.error('uploadFileToSection failed:', error);
    throw error;
  }
};
