import { createContext, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
//
import Auth from 'src/components/authentication/login/Auth';
import { RouteLogin } from 'src/config/routes';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

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


export default function DashboardLayout({ }) {
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


    return navigate(RouteLogin, { state: { from: location }, replace: true });
  };

  return (
    <DashboardContext.Provider value={{ reload: reloadApp }}>
      <Auth onAuth={handleOnAuth}>

        {loggedIn &&
          <RootStyle>
            {!reload && <DashboardNavbar onOpenSidebar={() => setOpen(true)} />}
            <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
            <MainStyle>
              <Outlet />
            </MainStyle>
          </RootStyle>}
      </Auth>
    </DashboardContext.Provider>
  );
}
