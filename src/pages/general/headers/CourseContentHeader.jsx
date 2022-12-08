/*
  Imports
*/
import { Grid, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService from '../../../services/CourseService';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [course, setCourse] = useState({});
  const { code, name, pre_id } = course;

  const navigate = useNavigate();

  const courseID = useParams().courseID;

  /*
    Handlers, Functions
  */
  const getData = () => {
    courseService
      .find(courseID)
      .then((data) => {
        setCourse(data);
      })
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/logout');
        navigate('-1');
      });
  };

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design
  */
  return (
    <>
      <Grid container spacing={0} style={{ paddingBottom: 20, paddingTop: 20 }}>
        <Grid item xs={12} sm={3} md={3}>
          <Typography fontWeight="bold">Course ID: </Typography>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Typography>{code || ''}</Typography>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Typography fontWeight="bold">Name: </Typography>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Typography>{name || ''}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={0} style={{ paddingBottom: 70, paddingTop: 10 }}>
        <Grid item xs={12} sm={3} md={3}>
          <Typography fontWeight="bold">Pre-requsites: </Typography>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Typography>{pre_id || ''}</Typography>
        </Grid>
      </Grid>
    </>
  );
};
