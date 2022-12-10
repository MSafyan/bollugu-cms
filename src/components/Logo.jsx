import PropTypes from 'prop-types';
// material
import { Box } from '@material-ui/core';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return (
    <Box
      margin="auto"
      component="img"
      src="/static/logo.webp"
      sx={{ width: 180, height: '100%', ...sx }}
    />
  );
}
