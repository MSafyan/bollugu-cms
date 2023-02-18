/*
    Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from 'src/components/Page';
import userService from 'src/services/UserService';
import Form from './forms/SettingsForm';

/*
    Main Working
*/
export default () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  function getData() {
    userService
      .getLoggedInUser()
      .then((user) => {
        console.log('User', user);
        setLoggedInUser(user);
      })
      .catch(() => {
        navigate('/404');
      });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <Page title="Settings">
      <Container maxWidth="xl">{loggedInUser && <Form user={loggedInUser} />}</Container>
    </Page>
  );
};
