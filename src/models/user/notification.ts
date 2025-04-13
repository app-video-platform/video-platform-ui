import { NotificationType } from './notifications.types';

export interface Notification {
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  id: number;
}