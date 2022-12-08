import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import { Icon } from '@iconify/react';
import { Button, Menu, MenuItem, Typography } from '@material-ui/core';
import { useState } from 'react';

export default (props) => {
  const [open, setOpen] = useState(null);

  const { sortingOptions } = props;
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const [selectedSort, setSelectedSort] = useState(sortingOptions[0].label);

  const handleSortChange = (e) => {
    const { myValue, myOrder, myLabel } = e.currentTarget.dataset;
    setSelectedSort(myLabel);
    props.onGetSort(myValue, myOrder);
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Icon icon={open ? chevronUpFill : chevronDownFill} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {selectedSort}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {sortingOptions.map((option) => (
          <MenuItem
            key={option.value}
            data-my-label={option.label}
            data-my-value={option.option}
            data-my-order={option.order}
            selected={option.label === selectedSort}
            onClick={(event) => {
              handleClose();
              handleSortChange(event);
            }}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
