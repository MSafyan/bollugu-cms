import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';


import {
  RouteForgetPass,
  RouteLandingPage,
  RouteResetPass
} from './config/routes';

import AdminAddCoordinator from './pages/admins/AddCoordinator';

import AddMenuItem from './pages/admins/AddMenuItem';
import MenuItems from './pages/admins/MenuItems';
import OrdersList from './pages/admins/tables/OrdersList';
import ForgetPassword from './pages/general/ForgetPassword';
import Login from './pages/general/Login';
import Logout from './pages/general/Logout';
import MenuItem from './pages/general/MenuItem';
import PageError from './pages/general/PageError';
import Profile from './pages/general/Profile';
import ResetPassword from './pages/general/ResetPassword';
import Settings from './pages/general/Settings';
import Orders from './pages/admins/Orders';





export default function Router() {
  return useRoutes([
    {
      path: RouteLandingPage,
      element: <LogoOnlyLayout adminLogin loginPage />,
      children: [{ path: 'login', element: <Login admin /> }]
    },
    {
      path: RouteLandingPage,
      element: <DashboardLayout adminLogin />,
      children: [
        { path: '', element: <MenuItems /> },
        {
          path: 'menu', element: <Outlet />, children: [
            { path: '', element: <MenuItems /> },
            { path: ':id', element: <MenuItem /> },
            { path: ':id/edit', element: <AddMenuItem editing /> },
            { path: 'add', element: <AddMenuItem /> },

          ]
        },


        { path: 'profile', element: <Profile /> },
        //{ path: '/tsearch', element: <TeacherSearch /> },
        { path: 'settings', element: <Settings /> },
        {
          path: 'coordinators/:coordinatorID/edit',
          element: <AdminAddCoordinator editing />
        },

        { path: 'orders', element: <Orders /> },
      ]
    },

    {
      path: RouteLandingPage,
      element: <LogoOnlyLayout />,
      children: [
        { path: 'logout', element: <Logout /> },
        { path: '404', element: <PageError e404 /> },
        { path: '401', element: <PageError /> },
        { path: '*', element: <Navigate to="/404" /> },
        { path: RouteForgetPass, element: <ForgetPassword /> },
        { path: RouteResetPass, element: <ResetPassword /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
