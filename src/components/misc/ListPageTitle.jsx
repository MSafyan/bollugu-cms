import { Stack, Typography } from '@material-ui/core';

export default ({ children }) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        {children}
      </Typography>
    </Stack>
  );
};
