export interface File {
  id: string;
  fileName: string;
  // Optionally include sectionId if a file is strictly part of a section:
  // sectionId?: string;
  userId?: string;      // Optional if redundant via product
  productId: string;
  size: number;         // In bytes
  path: string;
  fileType: string;
  hash: string;
  uploadedAt: Date;
  downloadCount: number;
  isPublic: boolean;
}