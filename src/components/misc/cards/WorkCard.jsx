import { Box, Card, Link, Stack, Typography } from '@material-ui/core';
import { Grid } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ColorBox } from 'src/pages/admins/forms/AboutForm';
import palette from 'src/theme/palette';
import { FoodPicture } from './FoodPicture';

export default ({ item }) => {
  const { title, image, background, layout, metaDescription, to } = item;

  const [mouse, setMouse] = useState(false);

  return (
    <Link to={`${to}/edit`} color="inherit" underline="hover" component={RouterLink}>
      <Grid
        container
        spacing={3}
        sx={{
          backgroundColor: mouse ? 'primary.lightest' : 'grey.200',
          height: '100%',
          borderRadius: '20px'
        }}
        onMouseEnter={() => setMouse(true)}
        onMouseLeave={() => setMouse(false)}
      >
        <Grid item xs={6}>
          <Typography>Background:</Typography>
        </Grid>
        <Grid item xs={6}>
          <ColorBox color={background.color} />
        </Grid>
        <Grid item sm={6} md={3}>
          <Box sx={{ height: '200px', width: '200px' }}>
            <img alt={image} src={image} />
          </Box>
        </Grid>
        <Grid item sm={6} md={3}>
          <Typography variant="h5" noWrap>
            {metaDescription}
          </Typography>
        </Grid>
        <Grid item sm={6} md={3}>
          <Box sx={{ height: '200px', width: '200px' }}>
            <img alt={layout.image.url} src={layout.image.url} />
          </Box>
        </Grid>

        <Typography variant="h5" noWrap>
          {title}
        </Typography>
      </Grid>
    </Link>
  );
};
