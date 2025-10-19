import { NotificationType } from '../../types/notifications.types';

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
}
