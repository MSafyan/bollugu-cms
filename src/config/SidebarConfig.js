import { Icon } from '@iconify/react';
import {
  LockIcon, MenuIcon,
  OrdersIcon, ProfileIcon
} from 'src/config/icons';

import {
  RouteMenu, RouteOrders, RouteProfile
} from 'src/config/routes';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export const sidebarConfig = {
  admin: [
    {
      title: 'Menu Items',
      path: RouteMenu,
      icon: getIcon(MenuIcon)
    },
    {
      title: 'Orders',
      path: RouteOrders,
      icon: getIcon(OrdersIcon)
    },

  ],

  general: [
    {
      title: 'Profile',
      path: RouteProfile,
      icon: getIcon(ProfileIcon)
    },
    {
      title: 'Logout',
      path: '/logout',
      icon: getIcon(LockIcon)
    },
  ]
};
