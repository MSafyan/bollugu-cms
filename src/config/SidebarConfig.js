import { Icon } from '@iconify/react';
import {
  CoordinatorsIcon,
  CoursesIcon,
  DashboardIcon,
  FeeIcon,
  MadarisIcon,
  PastClassesIcon,
  StudentsIcon,
  TeachersIcon
} from 'src/config/icons';

import Cookies from 'js-cookie';
import {
  RouteAdminDashboard, RouteAdminFee,
  RouteCoordinatorFee, RouteCoordinators,
  RouteCourses,
  RouteMadaris, RoutePastClasses, RouteSearchStudent,
  RouteSearchTeacher, RouteStudentDashboard,
  RouteStudentResult, RouteTeacherDashboard
} from 'src/config/routes';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export const sidebarConfig = {
  admin: [
    {
      title: 'dashboard',
      path: RouteAdminDashboard,
      icon: getIcon(DashboardIcon)
    },
    {
      title: 'madaris',
      path: RouteMadaris,
      icon: getIcon(MadarisIcon)
    },
    {
      title: 'coodinators',
      path: RouteCoordinators,
      icon: getIcon(CoordinatorsIcon)
    },
    {
      title: 'courses',
      path: RouteCourses,
      icon: getIcon(CoursesIcon)
    },
    {
      title: 'find students',
      path: RouteSearchStudent,
      icon: getIcon(StudentsIcon)
    },
    {
      title: 'find teachers',
      path: RouteSearchTeacher,
      icon: getIcon(TeachersIcon)
    },
    {
      title: 'fee',
      path: RouteAdminFee,
      icon: getIcon(FeeIcon)
    }
  ],
  coordinator: [
    {
      title: 'fee',
      path: RouteCoordinatorFee,
      icon: getIcon(FeeIcon)
    }
  ],

  teacher: [
    {
      title: 'dashboard',
      path: RouteTeacherDashboard,
      icon: getIcon(DashboardIcon)
    },
    {
      title: 'past classes',
      path: RoutePastClasses,
      icon: getIcon(PastClassesIcon)
    },
  ],
  student: [
    {
      title: 'dashboard',
      path: RouteStudentDashboard,
      icon: getIcon(DashboardIcon)
    },
    {
      title: 'result',
      path: RouteStudentResult,
      icon: getIcon(PastClassesIcon)
    },
  ],
  general: [

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
