import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Icon } from '@iconify/react';
import { Avatar, Box, Button, Divider, IconButton, MenuItem, Typography } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  RouteAdminProfile,
  RouteAdminSetting,
  RouteCoordinatorProfile,
  RouteCoordinatorSettings,
  RouteStudentProfile,
  RouteStudentSettings,
  RouteTeacherProfile,
  RouteTeacherSettings
} from 'src/config/routes';
import MenuPopover from '../../components/MenuPopover';
import userService from '../../services/UserService';

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: personFill,
    linkTo: '/admin/profile'
  },
  {
    label: 'Settings',
    icon: settings2Fill,
    linkTo: '/admin/settings'
  }
];

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const navigator = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ image: null, name: null, email: null });

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    navigator('/logout', { replace: true });
  };

  useEffect(() => {
    userService
      .getLoggedInUser()
      .then((res) => {
        setUser(res);
        MENU_OPTIONS[0].linkTo = RouteAdminProfile;
        MENU_OPTIONS[1].linkTo = RouteAdminSetting;
        if (res.isCoordinator) {
          MENU_OPTIONS[0].linkTo = RouteCoordinatorProfile;
          MENU_OPTIONS[1].linkTo = RouteCoordinatorSettings;
        }
        if (res.isTeacher) {
          MENU_OPTIONS[0].linkTo = RouteTeacherProfile;
          MENU_OPTIONS[1].linkTo = RouteTeacherSettings;
        }
        if (res.isStudent) {
          MENU_OPTIONS[0].linkTo = RouteStudentProfile;
          MENU_OPTIONS[1].linkTo = RouteStudentSettings;
        }
      })
      .catch(handleLogout);
  }, []);

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={user.image} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
