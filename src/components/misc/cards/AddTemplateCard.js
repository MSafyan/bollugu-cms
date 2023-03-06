import { Card, Link, Stack, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import palette from 'src/theme/palette';

export default ({ to }) => {
  const [mouse, setMouse] = useState(false);

  return (
    <Link to={to} color="inherit" underline="hover" component={RouterLink}>
      <Card
        style={{ backgroundColor: mouse ? palette.primary.lightest : 'white', height: '100%' }}
        onMouseEnter={() => setMouse(true)}
        onMouseLeave={() => setMouse(false)}
      >
        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography variant="h5" noWrap>
            Add Template
          </Typography>
        </Stack>
      </Card>
    </Link>
  );
};
