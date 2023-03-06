import { Box, Card, Link, Stack, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import palette from 'src/theme/palette';
import { FoodPicture } from './FoodPicture';
import { ShowFileContent } from './SitemapCard';

export default ({ item }) => {
  const { title, file, to } = item;

  const [mouse, setMouse] = useState(false);

  return (
    <Link to={`${to}/edit`} color="inherit" underline="hover" component={RouterLink}>
      <Card
        style={{ backgroundColor: mouse ? palette.primary.lightest : 'white', height: '100%' }}
        onMouseEnter={() => setMouse(true)}
        onMouseLeave={() => setMouse(false)}
      >
        <Stack spacing={1} sx={{ p: 3 }}>
          <ShowFileContent file={file} digits={100} />

          <Typography variant="h5" noWrap>
            {title ?? 'Food Name Here'}
          </Typography>
        </Stack>
      </Card>
    </Link>
  );
};
