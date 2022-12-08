/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';


import { useContext } from 'react';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from '../../components/Page';
import { StudentClassContext } from './context/StudentClassContext';
import ClassHeader from './header/ClassHeader';
import GradingSystemDetails from './header/GradingSystemDetails';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */

  const class_ = useContext(StudentClassContext).c;
  const navigate = useNavigate();


  /*
    Handlers, Functions
  */
  const toHome = () => {
    navigate(`/student/${class_.name}`);
  };


  /*
    Main Design
  */

  return (
    <Page title={class_.name}>
      <Container>
        <ListPageTitleWithLink onClick={toHome}>{class_.name}</ListPageTitleWithLink>
        <ClassHeader data={class_} />
        <br />
        <br />
        <ListPageTitle>{"Grading System"}</ListPageTitle>
        <br />
        <GradingSystemDetails data={class_} />

      </Container>
    </Page>
  );
};
