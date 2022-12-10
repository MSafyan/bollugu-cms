/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CenterLoading from 'src/components/misc/CenterLoading';
import { RouteAdminSetting } from 'src/config/routes';
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
  };


  const handleEdit = () => {
    navigate(RouteAdminSetting);
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
        </Container>
      )}
    </Page>
  );
};
