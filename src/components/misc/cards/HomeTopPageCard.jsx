import { Box, Card, Link, Stack, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import palette from 'src/theme/palette';
import { FoodPicture } from './FoodPicture';

export default ({ item }) => {
  const { images_list, to } = item;

  const [mouse, setMouse] = useState(false);

  return (
    <Link to={`${to}/edit`} color="inherit" underline="hover" component={RouterLink}>
      <Card
        style={{ backgroundColor: mouse ? palette.primary.lightest : 'white', height: '100%' }}
        onMouseEnter={() => setMouse(true)}
        onMouseLeave={() => setMouse(false)}
      >
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <FoodPicture alt={images_list} src={images_list} />
        </Box>

        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography variant="h5" noWrap>
            {item.order}
          </Typography>
        </Stack>
      </Card>
    </Link>
  );
};
