/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*
  Imports:
    Our Imports
    Components and Settings
*/
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import classService from 'src/services/ClassService';
import userService from 'src/services/UserService';
import Page from '../../components/Page';
import ClassesList from './tables/ClassesList';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const pageName = 'Dashboard';

  /*
    Handlers, Functions
  */
  const getData = async () => {
    const user = await userService.getLoggedInUser();
    setLoading(true);
    classService
      .getByStudent(user.id, 0, 400, user)
      .then((data) => {
        data.forEach((c) => {
          c.student = c.students[0];
        });
        setClasses(data.filter((d) => !d.blocked));
      })
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/logout');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design.
  */
  return (
    <Page title={pageName}>
      <Container>
        <ListPageTitle>{pageName}</ListPageTitle>
        {loading ? (
          <CenterLoading />
        ) : (

          <ClassesList classes={classes} />

        )}
      </Container>
    </Page>
  );
};
