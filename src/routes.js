import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

import { RouteForgetPass, RouteLandingPage, RouteResetPass } from './config/routes';

import AddHomeTops from './pages/admins/HomeTopPage/AddServices';
import HomeTops from './pages/admins/HomeTopPage/Services';
import HomeTop from './pages/general/HomeTopPage';

import AddHomeTemplate from './pages/admins/HomeSectionsPage/AddHomeTemplate';
import AddHomeService from './pages/admins/HomeSectionsPage/AddHomeService';
import HomeSections from './pages/admins/HomeSectionsPage/Services';
import HomeSection from './pages/general/HomeSectionsPage';

import AddHomeFooters from './pages/admins/HomeFooter/AddServices';
import HomeFooters from './pages/admins/HomeFooter/Services';
import HomeFooter from './pages/general/HomeFooter';

import AddWorks from './pages/admins/Work/AddServices';
import Works from './pages/admins/Work/Services';
import Work from './pages/general/Work';

import AddAbouts from './pages/admins/About/AddServices';
import Abouts from './pages/admins/About/Services';
import About from './pages/general/About';

import AddMenuItem from './pages/admins/AddMenuItem';
import MenuItems from './pages/admins/MenuItems';
import MenuItem from './pages/general/MenuItem';

import AddServices from './pages/admins/AddServices';
import Services from './pages/admins/Services';
import Service from './pages/general/Service';

import AddBackgrounds from './pages/admins/Backgrounds/AddServices';
import Backgrounds from './pages/admins/Backgrounds/Services';
import Background from './pages/general/Background';

import AddFavicons from './pages/admins/Favicons/AddServices';
import Favicons from './pages/admins/Favicons/Services';
import Favicon from './pages/general/Favicon';

import AddRobotsTxts from './pages/admins/RobotsTxts/AddServices';
import RobotsTxts from './pages/admins/RobotsTxts/Services';
import RobotsTxt from './pages/general/Robot';

import AddSitemaps from './pages/admins/Sitemaps/AddServices';
import Sitemaps from './pages/admins/Sitemaps/Services';
import Sitemap from './pages/general/Sitemap';

import Orders from './pages/admins/Orders';
import ForgetPassword from './pages/general/ForgetPassword';
import Login from './pages/general/Login';
import Logout from './pages/general/Logout';
import PageError from './pages/general/PageError';
import Profile from './pages/general/Profile';
import ResetPassword from './pages/general/ResetPassword';
import Settings from './pages/general/Settings';
import Success from './pages/general/Success';

export default function Router() {
  return useRoutes([
    {
      path: RouteLandingPage,
      element: <LogoOnlyLayout loginPage />,
      children: [{ path: '/', element: <Login admin /> }]
    },
    {
      path: RouteLandingPage,
      element: <LogoOnlyLayout loginPage />,
      children: [{ path: 'login', element: <Login admin /> }]
    },
    {
      path: RouteLandingPage,
      element: <DashboardLayout />,
      children: [
        { path: '', element: <HomeTops /> },
        {
          path: 'homeTopPage',
          element: <Outlet />,
          children: [
            { path: '', element: <HomeTops /> },
            { path: ':id', element: <HomeTop /> },
            { path: ':id/edit', element: <AddHomeTops editing /> },
            { path: 'add', element: <AddHomeTops /> }
          ]
        },
        {
          path: 'homeSectionsPage',
          element: <Outlet />,
          children: [
            { path: '', element: <HomeSections /> },
            { path: ':id/edit', element: <AddHomeService editing /> },
            { path: 'add', element: <AddHomeService /> },
            { path: 'template/:id/edit/:serviceId', element: <AddHomeTemplate editing /> },
            { path: 'template/add/:serviceId', element: <AddHomeTemplate /> }
          ]
        },
        {
          path: 'homeFooter',
          element: <Outlet />,
          children: [
            { path: '', element: <HomeFooters /> },
            { path: ':id', element: <HomeFooter /> },
            { path: ':id/edit', element: <AddHomeFooters editing /> },
            { path: 'add', element: <AddHomeFooters /> }
          ]
        },
        {
          path: 'about',
          element: <Outlet />,
          children: [
            { path: '', element: <Abouts /> },
            { path: ':id', element: <About /> },
            { path: ':id/edit', element: <AddAbouts editing /> },
            { path: 'add', element: <AddAbouts /> }
          ]
        },
        {
          path: 'work',
          element: <Outlet />,
          children: [
            { path: '', element: <Works /> },
            { path: ':id', element: <Work /> },
            { path: ':id/edit', element: <AddWorks editing /> },
            { path: 'add', element: <AddWorks /> }
          ]
        },
        {
          path: 'menu',
          element: <Outlet />,
          children: [
            { path: '', element: <MenuItems /> },
            { path: ':id', element: <MenuItem /> },
            { path: ':id/edit', element: <AddMenuItem editing /> },
            { path: 'add', element: <AddMenuItem /> }
          ]
        },
        {
          path: 'services',
          element: <Outlet />,
          children: [
            { path: '', element: <Services /> },
            { path: ':id', element: <Service /> },
            { path: ':id/edit', element: <AddServices editing /> },
            { path: 'add', element: <AddServices /> }
          ]
        },
        {
          path: 'backgrounds',
          element: <Outlet />,
          children: [
            { path: '', element: <Backgrounds /> },
            { path: ':id', element: <Background /> },
            { path: ':id/edit', element: <AddBackgrounds editing /> },
            { path: 'add', element: <AddBackgrounds /> }
          ]
        },
        {
          path: 'favicons',
          element: <Outlet />,
          children: [
            { path: '', element: <Favicons /> },
            { path: ':id', element: <Favicon /> },
            { path: ':id/edit', element: <AddFavicons editing /> },
            { path: 'add', element: <AddFavicons /> }
          ]
        },
        {
          path: 'robots',
          element: <Outlet />,
          children: [
            { path: '', element: <RobotsTxts /> },
            { path: ':id', element: <RobotsTxt /> },
            { path: ':id/edit', element: <AddRobotsTxts editing /> },
            { path: 'add', element: <AddRobotsTxts /> }
          ]
        },
        {
          path: 'sitemaps',
          element: <Outlet />,
          children: [
            { path: '', element: <Sitemaps /> },
            { path: ':id', element: <Sitemap /> },
            { path: ':id/edit', element: <AddSitemaps editing /> },
            { path: 'add', element: <AddSitemaps /> }
          ]
        },

        { path: 'profile', element: <Profile /> },
        { path: 'settings', element: <Settings /> },
        { path: 'orders', element: <Orders /> }
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
