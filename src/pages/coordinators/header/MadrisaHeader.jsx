/*
  Imports
*/
import { Grid, Typography } from '@material-ui/core';

/*
  Main Working
*/
export default ({ madrisa }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  let year = '-',
    students = '-',
    sections,
    classes,
    teachers = '-',
    courses = '-';

  if (madrisa.batch) {
    ({ year, students, sections, classes, teachers, courses } = madrisa.batch);
  }

  /*
    Main Design
  */
  return (
    <>
      <Grid container spacing={2} style={{ paddingBottom: 20, paddingTop: 20, paddingLeft: 10 }}>
        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Batch: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{year}</Typography>
        </Grid>
        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Students: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{students}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 10 }}>
        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Teachers: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{teachers}</Typography>
        </Grid>

        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Sections: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{sections?.length}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 10 }}>
        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Classes: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{classes?.length}</Typography>
        </Grid>
        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Courses: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{courses}</Typography>
        </Grid>
      </Grid>
    </>
  );
};
