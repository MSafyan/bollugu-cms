/*
  Imports
*/
import { Container, Typography } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

import { useContext } from 'react';
import AreaCharts from 'src/components/charts/AreaCharts';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from '../../components/Page';
import { StudentClassContext } from './context/StudentClassContext';
import ClassHeader from './header/ClassHeader';
import MarksList from './tables/MarksList';
import MarksList2 from './tables/MarksList2';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const class_ = useContext(StudentClassContext).c;
  const navigate = useNavigate();

  const tests = class_.students[0].marks.filter((m) => m.type === 'Test');
  const assignments = class_.students[0].marks.filter((m) => m.type === 'Assignment');
  const mid = class_.students[0].marks.filter((m) => m.type === 'Mid');
  const final = class_.students[0].marks.filter((m) => m.type === 'Final');

  const { finalWeightage, attendanceWeightage, midsWeightage, testWeightage, assignmentWeightage } = class_;
  const { attendanceFactors, assginmentsFactors, testFactors, midsFactor, finalFactors } = class_.students[0];
  const marksDistribution = [attendanceWeightage, assignmentWeightage, testWeightage, midsWeightage, finalWeightage];
  const labels = ['Attendance', 'Assignments', 'Tests', 'Mid Term', 'Final Exam'];
  const marksObtained = [attendanceFactors, assginmentsFactors, testFactors, midsFactor, finalFactors];

  const chartData = [
    {
      name: 'Maximum Marks',
      type: 'column',
      data: marksDistribution
    },
    {
      name: 'Obtained Marks',
      type: 'column',
      data: marksObtained,
    },
  ];

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

        <Typography variant="h6" gutterBottom>
          Assignments
        </Typography>

        <br />

        <MarksList data={assignments} />

        <br />
        <br />

        <Typography variant="h6" gutterBottom>
          Tests
        </Typography>

        <br />

        <MarksList data={tests} />
        <br />
        <br />

        <Typography variant="h6" gutterBottom>
          Mids
        </Typography>

        <br />

        <MarksList2 data={mid} />
        <br />
        <br />

        <Typography variant="h6" gutterBottom>
          Final
        </Typography>

        <br />

        <MarksList2 data={final} />
        <br />
        <br />
        <AreaCharts labels={labels} data={chartData} type={['solid', 'solid']} percent />
      </Container>
    </Page>
  );
};
