import { NotificationType } from './notifications.types';

export interface INotification {
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  id: number;
}
