import { Stack, Typography } from '@material-ui/core';
import { Link } from '@mui/material';

export default ({ children, onClick }) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Link component="button" onClick={onClick} underline="none" variant="h6">
        <Typography variant="h4" gutterBottom>
          {children}
        </Typography>
      </Link>
    </Stack>
  );
};
