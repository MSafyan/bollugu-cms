/*
  Imports
*/
import { Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*
  Imports
*/
import { Typography } from '@mui/material';
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

  const pageName = 'Past Classes';

  /*
    Handlers, Functions
  */

  const getData = async () => {
    const user = await userService.getLoggedInUser();
    setLoading(true);
    classService
      .getByTeacher(user.id, 0, 400)
      .then((data) => {
        data = data.filter((d) => !!d.blocked);
        data.sort((a, b) => b.batch.madrisa.id - a.batch.madrisa.id);
        const madrisas_l = [];
        data.forEach((a) => {
          madrisas_l.push(a.batch.madrisa.id);
        });
        const madrisas_s = new Set(madrisas_l);

        const madrisas = [];
        madrisas_s.forEach((m) => {
          madrisas.push(data.filter((_class) => _class.batch.madrisa.id === m));
        });
        setClasses(madrisas);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/logout');
        //TODO: Improve error handling here
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

          classes.length > 0 ?
            <>
              {React.Children.toArray(
                classes.map((b) => (
                  <>
                    <ListPageTitle>Madrisa: {b[0].batch.madrisa.name} - {b[0].batch.madrisa.code}</ListPageTitle>
                    <ClassesList classes={b} ended />
                    <br />
                    <br />
                  </>
                ))
              )}
            </>
            :
            <><Typography>You don't have any past classes yet</Typography></>

        )}
      </Container>
    </Page>
  );
};
