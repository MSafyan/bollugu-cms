/*
  Imports
*/
import { Grid, Typography } from '@material-ui/core';
import ItemImage from 'src/components/misc/ItemImage';
import { Days } from 'src/config/data';

import { DefaultFood } from 'src/config/settings';

/*
  Main Working
*/
export default ({ item }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const { title, svg } = item;

  /*
    Main Design
  */
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ItemImage Image={svg?.url ?? DefaultFood} />
        </Grid>
      </Grid>
      <Grid container spacing={0} style={{ paddingBottom: 20, paddingTop: 20 }}>
        <Grid item xs={12} sm={2} md={2}>
          <Typography fontWeight="bold">Title: </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography>{title}</Typography>
        </Grid>
      </Grid>
    </>
  );
};
