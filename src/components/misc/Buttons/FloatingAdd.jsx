import AddIcon from '@iconify/icons-carbon/add';
import { Icon } from '@iconify/react';
import { Fab, Tooltip } from '@material-ui/core';

export default ({ onClick, tooltip }) => {
  return (
    <Fab
      sx={{
        '&:hover': {
          backgroundColor: (theme) => theme.palette.action.hover,
          color: (theme) => theme.palette.primary.main
        },
        color: 'grey.0',
        backgroundColor: (theme) => theme.palette.primary.main,
        position: 'fixed',
        bottom: (theme) => theme.spacing(2),
        right: (theme) => theme.spacing(2)
      }}
      onClick={onClick}
    >
      {tooltip ? (
        <Tooltip title={tooltip}>
          <Icon icon={AddIcon} inline="true" style={{ fontSize: 30 }} />
        </Tooltip>
      ) : (
        <Icon icon={AddIcon} inline="true" style={{ fontSize: 30 }} />
      )}
    </Fab>
  );
};
