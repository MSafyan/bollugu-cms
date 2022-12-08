/*
  Imports
*/
import { Grid, Typography } from '@material-ui/core';

/*
  Main Working
*/
export default ({ data }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const { batch, students, course } = data;
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
          <Typography>{batch.year}</Typography>
        </Grid>
        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Students: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{students?.length}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 10 }}>
        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Course Code: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{course.code}</Typography>
        </Grid>
        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Course: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{course.name}</Typography>
        </Grid>
      </Grid>
    </>
  );
};
