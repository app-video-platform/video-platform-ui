import { RxDashboard } from 'react-icons/rx';
import {
  IoHelpCircleOutline,
  IoAnalyticsSharp,
  IoSettingsOutline,
  IoStorefrontOutline,
} from 'react-icons/io5';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { MdAdminPanelSettings, MdGroups } from 'react-icons/md';
import { LuLayoutDashboard } from 'react-icons/lu';

import { Route } from '../api/models/misc';
import { UserRole } from '../api/models/user';

export const appRoutes: Route[] = [
  {
    path: '/app',
    label: 'Dashboard',
    icon: LuLayoutDashboard,
    end: true,
    group: 'primary',
  },
  {
    path: '/app/products',
    label: 'Products',
    icon: RxDashboard,
    group: 'primary',
  },
  {
    path: '/app/customers',
    label: 'Customers',
    icon: MdGroups,
    group: 'primary',
  },
  {
    path: '/app/sales',
    label: 'Sales',
    icon: FaMoneyBillTrendUp,
    group: 'primary',
  },
  {
    path: '/app/analytics',
    label: 'Analytics',
    icon: IoAnalyticsSharp,
    group: 'primary',
  },
  {
    path: '/app/storefront',
    label: 'Storefront',
    icon: IoStorefrontOutline,
    group: 'primary',
    collapseSidebarOnLoad: true,
  },
  {
    path: '/app/admin',
    label: 'Admin',
    icon: MdAdminPanelSettings,
    allowedRoles: [UserRole.ADMIN],
    group: 'utility',
  },
  {
    path: '/app/settings',
    label: 'Settings',
    icon: IoSettingsOutline,
    group: 'utility',
  },
  {
    path: '/app/help',
    label: 'Help',
    icon: IoHelpCircleOutline,
    disabled: true,
    group: 'utility',
  },
  {
    path: '/app/products/edit',
    label: 'Edit',
    icon: IoSettingsOutline,
    hideFromSidebar: true,
    collapseSidebarOnLoad: true,
  },
  {
    path: '/app/products/:productId/landing-page',
    label: 'Landing Page',
    icon: IoSettingsOutline,
    hideFromSidebar: true,
    collapseSidebarOnLoad: true,
  },
];
