import { Icon } from '@iconify/react';
import {
  CoordinatorsIcon,
  CoursesIcon,
  DashboardIcon,
  FeeIcon,
  LockIcon,
  MadarisIcon,
  MenuIcon,
  OrdersIcon,
  PastClassesIcon,
  ProfileIcon,
  StudentsIcon,
  TeachersIcon
} from 'src/config/icons';

import Cookies from 'js-cookie';
import {
  RouteMenu, RouteAdminFee,
  RouteAdminProfile,
  RouteCoordinatorFee, RouteCoordinators,
  RouteCourses,
  RouteOrders, RoutePastClasses, RouteSearchStudent,
  RouteSearchTeacher, RouteStudentDashboard,
  RouteStudentResult, RouteTeacherDashboard
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
      path: RouteAdminProfile,
      icon: getIcon(ProfileIcon)
    },
    {
      title: 'Logout',
      path: '/logout',
      icon: getIcon(LockIcon)
    },
  ]
};

export const getCoordinatorSideBar = (coordinator) => {
  let coordinatorSide = [...sidebarConfig.coordinator];
  const cookies = Cookies.get();

  coordinator.madaris.forEach((madrisa) => {
    coordinatorSide.unshift({
      title: madrisa.name,
      path: `/coordinator/madaris/${madrisa.code}`,
      icon: getIcon(MadarisIcon)
    });
  });
  let max = 0;
  coordinatorSide.forEach((b) => {
    if (cookies[b.title] > max) {
      max = cookies[b.title];
      b.toOpen = true;
    }

  });
  return coordinatorSide;
};
