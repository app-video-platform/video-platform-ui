import { RootState } from 'core/api/models';

export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;
