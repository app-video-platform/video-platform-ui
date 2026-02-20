export interface ConfirmUploadRequestDto {
  sectionId?: string;
  key?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface FileS3UploadResponseDto {
  fileId?: string;
  fileName?: string;
  url?: string;
}
