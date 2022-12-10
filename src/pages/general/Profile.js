/*
  Imports
*/
import { Container } from '@material-ui/core';
import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, NavLink as RouterLink } from 'react-router-dom';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';

import CenterLoading from 'src/components/misc/CenterLoading';
import { RouteSetting } from 'src/config/routes';
import userService from 'src/services/UserService';

import Page from '../../components/Page';
import ChefOptions from './profile/ChefOptions';
import UserProfile from './profile/UserProfile';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: '' });

  const [onboarding, setOnboarding] = useState(false);

  const { name } = user;

  /*
    Handlers, Functions
  */
  const getData = () => {
    userService
      .getLoggedInUser()
      .then((u) => {
        setUser(u);
        setLoading(false);
      })
      .catch((_err) => {
        navigate('/404');
      });

    userService.checkOnBoarding().then((res) => {
      console.log("Well here", res)
      setOnboarding(res);
    }).catch((error) => { console.log("Well error here", error) })
  };

  function openStripeUrl(url) {
    window.open(url, '_blank');
  };


  const handleEdit = () => {
    navigate(RouteSetting);
  };

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design
  */
  return (
    <Page title={"Your Profile"}>
      {loading ? (
        <CenterLoading />
      ) : (
        <Container maxWidth="xl">
          <UserProfile user={user} />

          <ChefOptions user={user} handleEdit={handleEdit} />

          <Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10, justifyContent: 'flex-start' }}>

            <Grid style={{ marginRight: 20 }}>
              {onboarding &&
                <Button
                  fullWidth
                  variant="contained"
                  style={{ marginTop: 40, padding: '0px 53.7px' }}
                  size="large"
                  onClick={() => { openStripeUrl(onboarding?.url) }}
                >
                  {onboarding?.onboarding ? 'Check Wallet' : 'Setup Wallet'}
                </Button>
              }
            </Grid>

          </Grid>
        </Container>
      )}
    </Page>
  );
};
