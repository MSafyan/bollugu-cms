/*
  Imports
*/
import { Grid, Typography } from '@material-ui/core';
import ItemImage from 'src/components/misc/ItemImage';

import { Days, DefaultFood } from 'src/config/settings';

/*
  Main Working
*/
export default ({ item }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const { name, description, ingredients, image, availability, price } = item;

  /*
    Main Design
  */
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ItemImage Image={image.url ?? DefaultFood} />
        </Grid>
      </Grid>
      <Grid container spacing={0} style={{ paddingBottom: 20, paddingTop: 20 }}>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Name: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{name}</Typography>
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Price: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>${price}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10 }}>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Description: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{description}</Typography>
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Ingredients: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{ingredients}</Typography>
        </Grid>
      </Grid>
      {
        availability &&
        <Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10 }}>
          <Grid item xs={12} sm={2} md={2}>
            <Typography fontWeight="bold">Availability: </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Typography>{Days.filter((d, i) => availability[i]).join(", ").toString()}</Typography>
          </Grid>
        </Grid>
      }
    </>
  );
};
