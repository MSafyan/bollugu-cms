import { createContext, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import Auth from 'src/components/authentication/login/Auth';
import { RouteAdminLogin, RouteCoordinatorLogin, RouteStudentLogin, RouteTeacherLogin } from 'src/config/routes';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

export const DashboardContext = createContext();


export default function DashboardLayout({ adminLogin, coordinatorLogin, teacherLogin, studentLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [reload, setReload] = useState(false);
  const reloadApp = () => {
    setReload(true);
    setTimeout(() => { setReload(false); }, 1000);

  };

  const [open, setOpen] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);

  const handleOnAuth = (pass) => {
    if (pass)
      return setLoggedIn(true);

    if (adminLogin)
      return navigate(RouteAdminLogin, { state: { from: location }, replace: true });
    if (coordinatorLogin)
      return navigate(RouteCoordinatorLogin, { state: { from: location }, replace: true });
    if (teacherLogin)
      return navigate(RouteTeacherLogin);
    if (studentLogin)
      return navigate(RouteStudentLogin);
  };

  return (
    <DashboardContext.Provider value={{ reload: reloadApp }}>
      <Auth admin={adminLogin} coordinator={coordinatorLogin} teacher={teacherLogin} student={studentLogin} onAuth={handleOnAuth}>

        {loggedIn &&
          <RootStyle>
            {!reload && <DashboardNavbar isAdmin={adminLogin} onOpenSidebar={() => setOpen(true)} />}
            <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
            <MainStyle>
              <Outlet />
            </MainStyle>
          </RootStyle>}
      </Auth>
    </DashboardContext.Provider>
  );
}
