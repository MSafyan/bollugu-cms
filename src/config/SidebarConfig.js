import { Icon } from '@iconify/react';
import {
  backgroundFillIcon,
  faviconFillIcon,
  LockIcon,
  MenuIcon,
  OrdersIcon,
  ProfileIcon,
  projectFilledIcon,
  robotsIcon
} from 'src/config/icons';

import {
  RouteAbout,
  RouteBackgrouns,
  RouteFavicons,
  RouteHomeFooter,
  RoutehomeSectionsPage,
  RouteHomeTopPage,
  RouteMenu,
  RouteOrders,
  RouteRobots,
  RouteServices,
  RouteSitemap,
  RouteWork
} from 'src/config/routes';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export const sidebarConfig = {
  admin: [
    {
      title: 'HOME TOP PAGE',
      path: RoutehomeSectionsPage,
      icon: getIcon(RoutehomeSectionsPage)
    },
    {
      title: 'HOME SECTION PAGES',
      path: RouteHomeTopPage,
      icon: getIcon(RouteHomeTopPage)
    },
    {
      title: 'HOME FOOTER',
      path: RouteHomeFooter,
      icon: getIcon(RouteHomeFooter)
    },
    {
      title: 'ABOUT',
      path: RouteAbout,
      icon: getIcon(RouteAbout)
    },
    {
      title: 'SERVICES',
      path: RouteServices,
      icon: getIcon(projectFilledIcon)
    },
    {
      title: 'WORKS',
      path: RouteWork,
      icon: getIcon(RouteWork)
    },
    {
      title: 'BACKGROUNDS',
      path: RouteBackgrouns,
      icon: getIcon(backgroundFillIcon)
    },
    {
      title: 'FAVICON',
      path: RouteFavicons,
      icon: getIcon(faviconFillIcon)
    },
    {
      title: 'ROBOTS.TXT',
      path: RouteRobots,
      icon: getIcon(robotsIcon)
    },
    {
      title: 'SITEMAP.XML',
      path: RouteSitemap,
      icon: getIcon(OrdersIcon)
    },
    {
      title: 'BACKUP',
      path: RouteOrders,
      icon: getIcon(OrdersIcon)
    },
    {
      title: 'LIVE SUPPORT CHAT',
      path: RouteOrders,
      icon: getIcon(OrdersIcon)
    }
  ],

  general: [
    // {
    //   title: 'Profile',
    //   path: RouteProfile,
    //   icon: getIcon(ProfileIcon)
    // },
    {
      title: 'Logout',
      path: '/logout',
      icon: getIcon(LockIcon)
    }
  ]
};
