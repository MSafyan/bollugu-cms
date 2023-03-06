import { Stack, Typography } from '@material-ui/core';
import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/material';

export default ({ children, handleRemove, editing }) => {
  return (
    <Stack direction="row" alignItems="space-between" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        {children}
      </Typography>
      {handleRemove && editing && (
        <SimpleDialogDemo
          handleRemove={() => {
            console.log('handleRemove1');
            handleRemove();
          }}
        />
      )}
    </Stack>
  );
};

const emails = ['username@gmail.com', 'user02@gmail.com'];

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box sx={{ p: 3 }}>
        <Typography>Are you Sure you want to delete this Item</Typography>
        <Stack direction="row" spacing={2} alignItems="flex-end">
          <Button
            onClick={() => {
              console.log('handleRemove');
              props.handleRemove();
              handleClose();
            }}
          >
            Remove
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired
};

function SimpleDialogDemo({ handleRemove }) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        Remove Item
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        handleRemove={handleRemove}
      />
    </div>
  );
}
