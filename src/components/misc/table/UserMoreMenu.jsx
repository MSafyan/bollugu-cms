import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function UserMoreMenu({ ID, Options }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {Options.map((row, index) => {
          const { text, event, icon, id } = row;

          return (
            <MenuItem
              key={`${ID[0]} ${index} inner key`}
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                setIsOpen(false);
                event(ID[id]);
              }}
            >
              <ListItemIcon>
                <Icon icon={icon} width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
