/* eslint-disable no-console */
import httpClient from '../../http-client';
import { getCookie } from '@shared/utils';
import {
  ConfirmUploadRequestDto,
  FileDownloadProductResponse,
  FileS3UploadResponseDto,
  PresignedUrlResponseDto,
  UploadDownloadSectionFileRequest,
} from 'core/api/models';

export const getPresignedUrlAPI = async (
  productId: string,
  sectionId: string,
  fileName: string,
) => {
  try {
    const response = await httpClient.get<PresignedUrlResponseDto>(
      `/api/products/${productId}/sections/${sectionId}/files/presigned-url`,
      {
        params: {
          filename: fileName,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error getting presigned URL for section ${sectionId}:`,
      error,
    );
    throw error;
  }
};

export const uploadToPresignedUrl = async (
  presignedUrl: string,
  file: File,
) => {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error('File upload to presigned URL failed');
    }

    return response;
  } catch (error) {
    console.error('Error uploading to presigned URL:', error);
    throw error;
  }
};

export const confirmFileUploadAPI = async (
  productId: string,
  sectionId: string,
  payload: ConfirmUploadRequestDto,
) => {
  try {
    const response = await httpClient.post<FileS3UploadResponseDto>(
      `/api/products/${productId}/sections/${sectionId}/files/confirm-upload`,
      payload,
      {
        withCredentials: true,
        headers: {
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error confirming file upload:', error);
    throw error;
  }
};

export const deleteSectionFileAPI = async (
  productId: string,
  sectionId: string,
  fileId: string,
) => {
  try {
    await httpClient.delete(
      `/api/products/${productId}/sections/${sectionId}/files/${fileId}`,
      {
        withCredentials: true,
      },
    );
    return fileId;
  } catch (error) {
    console.error('Error deleting uploaded file:', error);
    throw error;
  }
};

export const uploadDownloadSectionFileAPI = async ({
  productId,
  sectionId,
  file,
}: UploadDownloadSectionFileRequest): Promise<FileDownloadProductResponse> => {
  const presigned = await getPresignedUrlAPI(productId, sectionId, file.name);

  if (!presigned.presignedUrl || !presigned.key) {
    throw new Error('Missing presigned upload details');
  }

  await uploadToPresignedUrl(presigned.presignedUrl, file);

  const confirmed = await confirmFileUploadAPI(productId, sectionId, {
    sectionId,
    key: presigned.key,
    fileUrl: presigned.fileUrl,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  return {
    id: confirmed.fileId,
    fileName: confirmed.fileName ?? file.name,
    size: file.size,
    fileType: file.type,
    url: confirmed.url ?? presigned.fileUrl,
  };
};
