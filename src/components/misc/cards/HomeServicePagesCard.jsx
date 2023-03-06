import { Box, Card, Link, Stack, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import palette from 'src/theme/palette';

export default ({ item }) => {
  const [mouse, setMouse] = useState(false);

  return (
    <Link to={`${item.id}/edit`} color="inherit" underline="hover" component={RouterLink}>
      <Card
        style={{ backgroundColor: mouse ? palette.primary.lightest : 'white', height: '100%' }}
        onMouseEnter={() => setMouse(true)}
        onMouseLeave={() => setMouse(false)}
      >
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ p: 3 }}>
          <Typography variant="h5" noWrap>
            {'Order: '}
            {item.order}
          </Typography>
          <Typography variant="h5" noWrap>
            {'URL: '}
            {item.url}
          </Typography>
          <Typography variant="h5" noWrap>
            {item.display_on_home_page ? 'Visible' : 'Hidden'}
          </Typography>
        </Stack>
      </Card>
    </Link>
  );
};
