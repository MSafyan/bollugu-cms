/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';


import { useContext } from 'react';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from '../../components/Page';
import ClassCards from './body/ClassCards';
import { StudentClassContext } from './context/StudentClassContext';
import ClassHeader from './header/ClassHeader';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const navigate = useNavigate();
  const class_ = useContext(StudentClassContext).c;


  /*
    Handlers, Functions
  */

  const toHome = () => {
    navigate(`/student/${class_.name}`);
  };

  /*
  Use Effect Hooks.
  */

  /*
    Main Design
  */
  return (
    <Page title={class_.name}>
      <Container>
        <ListPageTitleWithLink onClick={toHome}>{class_.name}</ListPageTitleWithLink>
        <ClassHeader data={class_} />
        <ClassCards />
      </Container>
    </Page>
  );
};
