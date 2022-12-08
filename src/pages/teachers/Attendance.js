/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';


import { useContext } from 'react';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from '../../components/Page';
import { ClassContext } from './context/ClassContext';
import ClassHeader from './header/ClassHeader';
import AttendanceHistory from './tables/AttendanceHistory';
import AttendanceSummary from './tables/AttendanceSummary';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */

  const navigate = useNavigate();
  const class_ = useContext(ClassContext).c;
  const reload = useContext(ClassContext).reload;

  /*
    Handlers, Functions
  */
  const handleAdd = () => {
    navigate('./add');
  };

  const toHome = () => {
    navigate(`/teacher/${class_.name}`);
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
        <AttendanceHistory past={class_.blocked} attendance_data={class_.attendance} reload={reload} />
        <br />
        <br />
        <AttendanceSummary
          attendance_summary_data={class_.students}
          attendanceLimit={class_.attendancePercentage}
        />
        {!class_.blocked && <FloatingAdd tooltip='Mark Attendance' onClick={handleAdd} />}
      </Container>
    </Page>
  );
};
