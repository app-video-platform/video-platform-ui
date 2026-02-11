import { NotificationType } from '../product';

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
}
