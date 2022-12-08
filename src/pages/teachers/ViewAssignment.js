/*
  Imports
*/
import { Container, Typography } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';

import { useContext } from 'react';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from '../../components/Page';
import { ClassContext } from './context/ClassContext';
import ClassHeader from './header/ClassHeader';
import ViewAssignmentList from './tables/ViewAssignmentList';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const navigate = useNavigate();
  const class_ = useContext(ClassContext).c;
  const aID = useParams().aID;
  const assignment = class_.assignments.find((a) => a.id == aID);

  for (const s of class_.students) {
    s.submittedAss = assignment.submissions.find((sub) => sub.id == s.id);

    if (s.submittedAss) {
      s.submittedAss_ = true;
      s.submittedDate = s.submittedAss.file.uploadedOn;
    } else {
      s.submittedAss_ = false;
    }
  }

  /*
    Handlers, Functions
  */
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
        <Typography variant="h6" gutterBottom>
          {assignment.topic}
        </Typography>
        <Typography
          variant="subtitle1"
        >
          {assignment.description}
        </Typography>

        <br />
        <br />

        <Typography variant="h6" gutterBottom>
          Total Marks: {assignment.marks}
        </Typography>

        <br />

        <ViewAssignmentList file={assignment.file} students_data={class_.students} submissions={assignment.submissions.length} />
      </Container>
    </Page>
  );
};
