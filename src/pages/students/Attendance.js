/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';


import { useContext } from 'react';
import PassFailChart from 'src/components/charts/PassFailChart';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from '../../components/Page';
import { StudentClassContext } from './context/StudentClassContext';
import ClassHeader from './header/ClassHeader';
import AttendanceHistory from './tables/AttendanceHistory';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */

  const navigate = useNavigate();
  const class_ = useContext(StudentClassContext).c;
  const { presents } = class_.students[0];
  const absents = class_.students[0].attendance.length - presents;

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
        <br />
        <br />
        <PassFailChart
          //type='pie'
          title="Summary"
          labels={['Present', 'Absent']}
          data={[presents, absents]}
        />
        <br />
        <br />
        <AttendanceHistory data={class_.students[0].attendance} />
      </Container>
    </Page>
  );
};
