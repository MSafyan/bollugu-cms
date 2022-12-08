/*
  Imports
*/
import { Grid, Typography } from '@material-ui/core';
import LimitsGraph from 'src/components/charts/LimitsGraph';

/*
  Main Working
*/
export default ({ data }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const {
    attendancePercentage,
    finalWeightage,
    attendanceWeightage,
    midsWeightage,
    testWeightage,
    assignmentWeightage
  } = data;
  const marksDistribution = [
    attendanceWeightage,
    assignmentWeightage,
    testWeightage,
    midsWeightage,
    finalWeightage
  ];
  const categories = ['Attendance', 'Assignments', 'Tests', 'Mid Term', 'Final Exam'];
  /*
    Main Design
  */
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Final exams eligibility critera
      </Typography>
      <Grid container spacing={2} style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 10 }}>
        <Grid item xs={6} sm={3} md={3}>
          <Typography fontWeight="bold">Attendance: </Typography>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <Typography>{attendancePercentage}%</Typography>
        </Grid>
      </Grid>
      <br />
      <br />
      <LimitsGraph
        title="Marks Distribution"
        name="Marks"
        data={marksDistribution}
        categories={categories}
      />
      <br />
      <Grid container spacing={2} style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 10 }}>
        <Grid item xs={6} sm={3} md={3}>
          <Typography fontWeight="bold">Attendance: </Typography>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <Typography>{attendanceWeightage}%</Typography>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <Typography fontWeight="bold">Assignments: </Typography>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <Typography>{assignmentWeightage}%</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 10 }}>
        <Grid item xs={6} sm={3} md={3}>
          <Typography fontWeight="bold">Tests: </Typography>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <Typography>{testWeightage}%</Typography>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <Typography fontWeight="bold">Mid Term Exam: </Typography>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <Typography>{midsWeightage}%</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 10 }}>
        <Grid item xs={6} sm={3} md={3}>
          <Typography fontWeight="bold">Final Exam: </Typography>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <Typography>{finalWeightage}%</Typography>
        </Grid>
      </Grid>
    </>
  );
};
