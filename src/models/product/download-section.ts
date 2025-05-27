export interface DownloadSection {
  localId?: string;
  id?: string;
  title: string;
  description: string;
  files?: File[];
  position?: number;
}