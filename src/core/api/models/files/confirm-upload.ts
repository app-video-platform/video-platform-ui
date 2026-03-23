export interface ConfirmUploadRequestDto {
  sectionId?: string;
  key?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface PresignedUrlResponseDto {
  fileId?: string;
  presignedUrl?: string;
  key?: string;
  fileUrl?: string;
}

export interface FileS3UploadResponseDto {
  fileId?: string;
  fileName?: string;
  url?: string;
}

export interface UploadDownloadSectionFileRequest {
  productId: string;
  sectionId: string;
  file: File;
}
