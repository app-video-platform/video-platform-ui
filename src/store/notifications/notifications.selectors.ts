import { RootState } from '@api/models';

export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;
