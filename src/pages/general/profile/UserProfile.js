/*
  Imports
*/
import { Grid, Typography } from '@material-ui/core';
import ProfileAvatar from 'src/components/misc/ProfileAvatar';

import { DefaultAvatar } from 'src/config/settings';
import { getAge } from 'src/utils/dateTime';

/*
  Main Working
*/
export default ({ user }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const { image, firstName, cuisineName, email, long, city, province, phoneNumber, dob, blocked } = user;

  const dateOfBirth = new Date(dob);
  const age = getAge(dateOfBirth);
  const birthday = `${dateOfBirth.toDateString()} (${age} Years)`;

  /*
    Main Design
  */
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProfileAvatar Image={image ? image.url : DefaultAvatar} locked={blocked} />
        </Grid>
      </Grid>
      <Grid container spacing={0} style={{ paddingBottom: 20, paddingTop: 20 }}>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Name: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{firstName}</Typography>
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Location: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{city}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10 }}>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Contact No: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{phoneNumber}</Typography>
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Email: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{email}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10 }}>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Cuisine: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{cuisineName.split(",").join(", ")}</Typography>
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Bio: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{long}</Typography>
        </Grid>
      </Grid>
    </>
  );
};
