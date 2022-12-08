import { Icon } from '@iconify/react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import * as React from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertSnackbar({ children, severity, open, vertical, horizontal, icon }) {
  const v = vertical ?? 'bottom';
  const h = horizontal ?? 'right';
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar anchorOrigin={{ vertical: v, horizontal: h }} open={open}>
        <Alert
          icon={icon ? <Icon icon={icon} /> : undefined}
          severity={severity}
          sx={{ width: '100%' }}
        >
          {children}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
