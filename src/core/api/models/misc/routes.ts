import { IconType } from 'react-icons';
import { UserRole } from '../user/user';

export interface Route {
  path: string;
  label: string;
  icon: IconType;
  end?: boolean;
  allowedRoles?: UserRole[];
  hideFromSidebar?: boolean;
  collapseSidebarOnLoad?: boolean;
}
