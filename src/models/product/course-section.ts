export interface CourseSection {
  localId?: string;
  id?: string;
  title: string;
  description: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT';
  videoUrl?: string;
  textContent?: string;
  position?: number;
}