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
  const { teacher, course } = data;
  /*
    Main Design
  */
  return (
    <>
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
      <Grid container spacing={2} style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 10 }}>
        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Teacher: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{teacher.name}</Typography>
        </Grid>
        {/* <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Course: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Typography>{course.name}</Typography>
        </Grid> */}
      </Grid>
    </>
  );
};
