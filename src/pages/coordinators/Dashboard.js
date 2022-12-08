/*
  Imports
*/
import { Container, Stack, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from 'src/components/Page';
import { getCoordinatorSideBar } from 'src/config/SidebarConfig';
import userService from 'src/services/UserService';
import { ContentStyle } from 'src/theme/logo-only-pages';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const navigator = useNavigate();

  /*
    Handlers, Functions
  */
  const handleRedirect = async () => {
    const user = await userService.getLoggedInUser();
    if (user.isCoordinator) {
      const cSidebar = getCoordinatorSideBar(user);
      for (let i = cSidebar.length - 1; i > 0; i--) {
        const s = cSidebar[i];
        if (s.toOpen) {
          navigator(s.path, { replace: true });
          return;
        }
      }
      navigator(cSidebar[0].path, { replace: true });
    }

  };

  /*
    Use Effect Hooks.
  */
  useEffect(handleRedirect, []);

  /*
    Main Design
  */
  return (
    <Page title="Dashboard">
      <Container>
        <ContentStyle>
          <Stack sx={{ mb: 6 }}>
            <Typography variant="h4" style={{ textAlign: 'center' }} gutterBottom>
              Wait...
            </Typography>
          </Stack>
        </ContentStyle>
      </Container>
    </Page>
  );
};
