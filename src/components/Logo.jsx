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
      src="/static/ISDP.png"
      sx={{ width: 180, height: 59.5, ...sx }}
    />
  );
}
