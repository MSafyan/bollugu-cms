import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

import { RouteForgetPass, RouteLandingPage, RouteResetPass } from './config/routes';


import AddMenuItem from './pages/admins/AddMenuItem';
import MenuItems from './pages/admins/MenuItems';
import Orders from './pages/admins/Orders';
import ForgetPassword from './pages/general/ForgetPassword';
import Login from './pages/general/Login';
import Logout from './pages/general/Logout';
import MenuItem from './pages/general/MenuItem';
import PageError from './pages/general/PageError';
import Profile from './pages/general/Profile';
import ResetPassword from './pages/general/ResetPassword';
import Settings from './pages/general/Settings';
import Success from './pages/general/Success';

export default function Router() {
  return useRoutes([
    {
      path: RouteLandingPage,
<<<<<<< HEAD
      element: <LogoOnlyLayout loginPage />,
=======
      element: <LogoOnlyLayout adminLogin loginPage />,
      children: [{ path: '/', element: <Login admin /> }]
    },
    {
      path: RouteLandingPage,
      element: <LogoOnlyLayout adminLogin loginPage />,
>>>>>>> 2380ab7ff9fb0d7e4bf8b4ca01ef6e2361b5868b
      children: [{ path: 'login', element: <Login admin /> }]
    },
    {
      path: RouteLandingPage,
      element: <DashboardLayout />,
      children: [
        { path: '', element: <MenuItems /> },
        {
          path: 'menu',
          element: <Outlet />,
          children: [
            { path: '', element: <MenuItems /> },
<<<<<<< HEAD
            { path: ':id', element: <MenuItem /> },
            { path: ':id/edit', element: <AddMenuItem editing /> },
            { path: 'add', element: <AddMenuItem /> },

=======
            { path: ':id', element: <MenuItem /> }
>>>>>>> 2380ab7ff9fb0d7e4bf8b4ca01ef6e2361b5868b
          ]
        },

        { path: 'profile', element: <Profile /> },
        { path: 'settings', element: <Settings /> },
        { path: 'orders', element: <Orders /> },
      ]
    },

    {
      path: RouteLandingPage,
      element: <LogoOnlyLayout />,
      children: [
        { path: 'logout', element: <Logout /> },
        { path: 'complete', element: <Success /> },
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
