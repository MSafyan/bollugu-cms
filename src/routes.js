import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

import { RouteForgetPass, RouteLandingPage, RouteResetPass } from './config/routes';

import AdminAddCoordinator from './pages/admins/AddCoordinator';
import AdminAddCourse from './pages/admins/AddCourse';
import AdminAddFee from './pages/admins/AddFee';
import AdminAddMadrisa from './pages/admins/AddMadrisa';
import AdminBatch from './pages/admins/Classes';
import AdminCoordinators from './pages/admins/Coordinators';
import AdminCourses from './pages/admins/Courses';
import AdminDashboard from './pages/admins/Dashboard';
import AdminFee from './pages/admins/Fee';
import AdminMadaris from './pages/admins/Madaris';
import AdminMadrisa from './pages/admins/Madrisa';
import AdminSearch from './pages/admins/Search';

import CourseContent from './pages/general/CourseContent';
import ForgetPassword from './pages/general/ForgetPassword';
import Login from './pages/general/Login';
import Logout from './pages/general/Logout';
import PageError from './pages/general/PageError';
import Profile from './pages/general/Profile';
import ResetPassword from './pages/general/ResetPassword';
import Settings from './pages/general/Settings';
import MenuItems from './pages/admins/MenuItems';
import MenuItem from './pages/general/MenuItem';

export default function Router() {
  return useRoutes([
    {
      path: RouteLandingPage,
      element: <LogoOnlyLayout adminLogin loginPage />,
      children: [{ path: '/', element: <Login admin /> }]
    },
    {
      path: RouteLandingPage,
      element: <LogoOnlyLayout adminLogin loginPage />,
      children: [{ path: 'login', element: <Login admin /> }]
    },
    {
      path: RouteLandingPage,
      element: <DashboardLayout adminLogin />,
      children: [
        {
          path: 'menu',
          element: <Outlet />,
          children: [
            { path: '', element: <MenuItems /> },
            { path: ':id', element: <MenuItem /> }
          ]
        },

        { path: 'profile', element: <Profile /> },
        //{ path: '/tsearch', element: <TeacherSearch /> },
        { path: 'settings', element: <Settings /> },
        {
          path: 'coordinators/:coordinatorID/edit',
          element: <AdminAddCoordinator editing />
        },
        { path: 'coordinators/add', element: <AdminAddCoordinator /> },
        { path: 'coordinators', element: <AdminCoordinators /> },
        { path: 'madaris/add', element: <AdminAddMadrisa /> },
        { path: 'madaris/:mid/edit', element: <AdminAddMadrisa editing /> },
        { path: 'madaris/:mid/:bid', element: <AdminBatch /> },
        { path: 'madaris/:mid', element: <AdminMadrisa /> },

        { path: 'madaris', element: <AdminMadaris /> },
        { path: 'courses/add', element: <AdminAddCourse /> },
        { path: 'courses/:courseID', element: <CourseContent /> },
        { path: 'courses', element: <AdminCourses /> },
        { path: 'addcourse', element: <AdminAddCourse /> },
        { path: 'students/search', element: <AdminSearch /> },
        { path: 'teachers/search', element: <AdminSearch isTeacher /> },
        { path: ':type/:id', element: <Profile /> },
        { path: 'fee', element: <AdminFee /> },
        { path: 'fee/add', element: <AdminAddFee /> }
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
