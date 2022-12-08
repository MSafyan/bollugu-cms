/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/*
  Imports:
    Our Imports
    Components and Settings
*/
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from '../../components/Page';
import { ClassContext } from './context/ClassContext';
import ClassHeader from './header/ClassHeader';
import ClassesStudentsList from './tables/ClassesStudentsList';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const navigate = useNavigate();

  const class_ = useContext(ClassContext).c;

  const toHome = () => {
    navigate(`/teacher/${class_.name}`);
  };
  /*
    Main Design.
  */
  return (
    <Page title={class_.name}>
      <Container>
        <ListPageTitleWithLink onClick={toHome}>{class_.name}</ListPageTitleWithLink>

        <ClassHeader data={class_} />
        <br />
        <br />
        <ClassesStudentsList
          classData={class_.students}
          attendanceLimit={class_.attendancePercentage}
        />
      </Container>
    </Page>
  );
};
