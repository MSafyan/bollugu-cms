/*
	Imports
*/
import { Grid, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import madrisaService from '../../../services/MadrisaService';

/*
	Main Working
*/
export default () => {
  /*
	  States, Params, Navigation, Query, Variables.
	*/
  const [madrisa, setMadrisa] = useState({});
  const { code, name, cid, cname, address, city, province } = madrisa;

  const madrisaID = useParams().mid;

  const navigate = useNavigate();

  /*
	  Handlers, Functions
	*/
  const getData = () => {
    madrisaService
      .getOne(madrisaID, ['contact.city', 'coordinators.user'])
      .then((data) => {
        setMadrisa(data);
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
      <Grid container spacing={2} style={{ paddingBottom: 20, paddingTop: 20 }}>
        <Grid item xs={12} sm={1} md={1}>
          <Typography fontWeight="bold">ID: </Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={5}>
          <Typography>{code || ''}</Typography>
        </Grid>
        <Grid item xs={12} sm={1} md={1}>
          <Typography fontWeight="bold">Name: </Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={5}>
          <Typography>{name || ''}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingBottom: 10, paddingTop: 10 }}>
        <Grid item xs={12} sm={1} md={1}>
          <Typography fontWeight="bold">Co ID: </Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={5}>
          <Typography>{cid || ''}</Typography>
        </Grid>
        <Grid item xs={12} sm={1} md={1}>
          <Typography fontWeight="bold">Co Name: </Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={5}>
          <Typography>{cname || ''}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingBottom: 10, paddingTop: 10 }}>
        <Grid item xs={12} sm={2} md={1}>
          <Typography fontWeight="bold">Address: </Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={5}>
          <Typography>{`${address || ''}, ${city || ''}, ${province || ''}`}</Typography>
        </Grid>
      </Grid>
    </>
  );
};
