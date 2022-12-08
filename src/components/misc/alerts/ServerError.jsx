import { Alert, Collapse, Stack } from '@material-ui/core';

export default ({ open, children, collapse, severity = 'error' }) => {
  return (
    <>
      {open && (
        <Stack marginTop={3} sx={{ width: '50%' }}>
          {collapse ? (
            <Collapse in={collapse}>
              <Alert severity={severity}>{children}</Alert>
            </Collapse>
          ) : (
            <Alert severity={severity}>{children}</Alert>
          )}
        </Stack>
      )}
    </>
  );
};
