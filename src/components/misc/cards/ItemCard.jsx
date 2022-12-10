import { Box, Card, Link, Stack, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import palette from 'src/theme/palette';
import Label from '../Label';
import { CardAvatar } from './CardAvatar';
import { FoodPicture } from './FoodPicture';

export default ({ item }) => {
  const { name, image, description, price, to } = item;

  const [mouse, setMouse] = useState(false);

  return (
    <Link to={to} target="_blank" color="inherit" underline="hover" component={RouterLink}>
      <Card
        style={{ backgroundColor: mouse ? palette.primary.lightest : 'white', height: '100%' }}
        onMouseEnter={() => setMouse(true)}
        onMouseLeave={() => setMouse(false)}
      >
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <FoodPicture alt={name} src={image} />
        </Box>

        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography variant="h5" noWrap align="center">
            ${price}
          </Typography>
          <Typography variant="h5" noWrap>
            {name ?? 'Food Name Here'}
          </Typography>

          <Typography variant="subtitle2">{description}</Typography>
        </Stack>
      </Card>
    </Link>
  );
};
