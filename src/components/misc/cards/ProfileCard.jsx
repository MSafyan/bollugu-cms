import { Box, Card, Link, Stack, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Label from '../Label';
import { CardAvatar } from './CardAvatar';

export default ({ item }) => {
  const { name, image, username, madrisa, status, to } = item;

  return (
    <Link to={to} target="_blank" color="inherit" underline="hover" component={RouterLink}>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {status && (
            <Label
              variant="filled"
              color={(status === 'teacher' && 'error') || 'info'}
              sx={{
                zIndex: 9,
                top: 16,
                right: 16,
                position: 'absolute',
                textTransform: 'uppercase'
              }}
            >
              {madrisa}
            </Label>
          )}
          <CardAvatar alt={name} src={image} />
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="subtitle2" noWrap>
            {name}
            <br />
            {username}
          </Typography>
        </Stack>
      </Card>
    </Link>
  );
};
