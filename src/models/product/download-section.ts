export interface Section {
  id: string;
  title: string;
  description: string;
  files: File[];
  position?: number;
}