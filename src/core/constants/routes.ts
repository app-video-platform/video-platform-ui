import { RxDashboard } from 'react-icons/rx';
import {
  IoHomeOutline,
  IoPlanetOutline,
  IoAnalyticsSharp,
  IoSettingsOutline,
} from 'react-icons/io5';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { TiMessages } from 'react-icons/ti';

import { Route } from '../api';

export const appRoutes: Route[] = [
  {
    path: '/app',
    label: 'Overview',
    icon: IoHomeOutline,
    end: true,
  },
  {
    path: '/app/products',
    label: 'Products',
    icon: RxDashboard,
    collapseSidebarOnLoad: true,
  },
  {
    path: '/app/sales',
    label: 'Sales',
    icon: FaMoneyBillTrendUp,
  },
  {
    path: '/app/marketing',
    label: 'Marketing',
    icon: IoPlanetOutline,
  },
  {
    path: '/app/analytics',
    label: 'Analytics',
    icon: IoAnalyticsSharp,
  },
  {
    path: '/app/messages',
    label: 'Messages',
    icon: TiMessages,
  },
  {
    path: '/app/settings',
    label: 'Settings',
    icon: IoSettingsOutline,
  },
  {
    path: '/app/products/edit',
    label: 'Edit',
    icon: IoSettingsOutline,
    collapseSidebarOnLoad: true,
  },
];
