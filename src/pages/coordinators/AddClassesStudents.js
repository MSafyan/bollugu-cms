/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import StudentSearchForClass from './body/StudentSearchForClass';
import { CoordinatorClassContext } from './context/CoordinatiorClassContext';
import { MadrisaContext } from './context/MadrisaContext';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [loading, setLoading] = useState(true);
  const { c: class_, reload: reloadClass } = useContext(CoordinatorClassContext);
  const { madrisa, reload: reloadMadrisa } = useContext(MadrisaContext);

  const navigate = useNavigate();

  const pageName = class_.name;

  /*
    Handlers, Functions
  */
  const getData = () => {
    if (class_.blocked)
      return navigate('..');
    setLoading(false);
  };

  const reload = () => {
    reloadMadrisa();
    reloadClass();
  };

  /*
    Use Effect Hooks.
  */
  useEffect(() => {
    if (madrisa.blocked)
      return navigate("..");
    getData();
  }, []);

  /*
    Main Design.
  */
  return (
    <Page title={pageName}>
      <Container>
        <ListPageTitle>{pageName}</ListPageTitle>
        {!loading && <StudentSearchForClass getData={reload} class_={class_} />}
      </Container>
    </Page>
  );
};
