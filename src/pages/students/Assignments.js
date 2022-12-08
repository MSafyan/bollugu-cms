/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';


import { useContext } from 'react';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from '../../components/Page';
import { StudentClassContext } from './context/StudentClassContext';
import ClassHeader from './header/ClassHeader';
import AssignmentList from './tables/AssignmentList';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */

  const navigate = useNavigate();

  const class_ = useContext(StudentClassContext).c;
  const reload = useContext(StudentClassContext).reload;

  const currentDate = new Date().getTime();
  const assignments = class_.assignments.filter((a) => new Date(a.start).getTime() < currentDate);
  const student = class_.students[0];

  for (const a of assignments) {
    a.submitted = a.submissions.find((s) => s.id == student.id);
    const endDate = new Date(a.end).getTime();
    if (endDate > currentDate) {
      if (a.submitted) {
        a.status = 'Uploaded';
        a.status_id = 1;
      }
      else {
        a.status = 'Pending';
        a.status_id = 0;
      }
    }
    else {
      if (a.submitted) {
        a.status = 'Submitted';
        a.status_id = 2;
      }
      else {
        a.status = 'Expired';
        a.status_id = 3;
      }
    }
  }

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
        <AssignmentList data={assignments} reload={reload} student={student} past={class_.blocked} />
      </Container>
    </Page>
  );
};
