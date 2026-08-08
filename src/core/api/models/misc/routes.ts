import { IconType } from 'react-icons';

export interface Route {
  path: string;
  label: string;
  icon: IconType;
  end?: boolean;
  hideFromSidebar?: boolean;
  collapseSidebarOnLoad?: boolean;
}
