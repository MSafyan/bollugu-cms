import { Outlet, useNavigate } from 'react-router-dom';
// material
import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
// components
import { useState } from 'react';
import Auth from 'src/components/authentication/login/Auth';
import TitleResponsive from 'src/components/misc/TitleResponsive';
import Logo from '../components/Logo';
import { RouteMenu } from 'src/config/routes';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  }
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout({ loginPage }) {
  const navigate = useNavigate();

  const [showPage, setShowPage] = useState(!loginPage);

  const handleOnAuth = (pass) => {
    if (!pass) return setShowPage(true);
    return navigate(RouteMenu);
  };

  return (
    <Auth onAuth={handleOnAuth}>
      {showPage && (
        <>
          <HeaderStyle>
            <Box sx={{ display: { xs: 'block', md: 'none', lg: 'none' } }}>
              <Logo />
              <TitleResponsive />
            </Box>
          </HeaderStyle>
          <br></br>
          <Outlet />
        </>
      )}
    </Auth>
  );
}
