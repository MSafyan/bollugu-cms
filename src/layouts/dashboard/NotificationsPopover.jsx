import bellFill from '@iconify/icons-eva/bell-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import doneAllFill from '@iconify/icons-eva/done-all-fill';
import { Icon } from '@iconify/react';
import {
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography
} from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { NotificationReload, NotificationSound } from 'src/config/settings';
import notificationService from 'src/services/NotificationService';
import userService from 'src/services/UserService';
import MenuPopover from '../../components/MenuPopover';
import Scrollbar from '../../components/Scrollbar';

function renderContent(notification) {
  return (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};

function NotificationItem({ notification }) {
  const title = renderContent(notification);

  const handleRead = () => {
    if (notification.read) return;
    notification.read = true;

    if (notification.readInArray) notificationService.markReadA(notification.id, notification.sid);
    else
      notificationService.markRead(notification.id).catch(() => {
        notification.read = false;
      });
  };

  return (
    <ListItemButton
      onClick={handleRead}
      to={notification.url}
      disableGutters
      component={notification.url ? RouterLink : undefined}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.read && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={Icon} icon={clockFill} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {formatDistanceToNow(new Date(notification.createdAt))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastNotifications, setLN] = useState(-1);
  const totalUnRead = notifications.filter((item) => item.read === false).length;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    const newNoti = notifications.map((notification) => {
      if (!notification.read) {
        notification.read = true;
        if (notification.readInArray)
          notificationService.markReadA(notification.id, notification.sid);
        else
          notificationService.markRead(notification.id).catch(() => {
            notification.read = false;
          });
      }
      return {
        ...notification,
        read: true
      };
    });

    setNotifications(newNoti);
  };

  const getNotifcations = async () => {
    const user = await userService.getLoggedInUser();
    let toCall = notificationService.getAllCoordinators;
    if (user.isTeacher) toCall = notificationService.getAllTeachers;
    if (user.isStudent) toCall = notificationService.getAllStudent;
    toCall(user.id, 0, 400)
      .then((data) => {
        setNotifications(data);
      })
      .catch(() => {
        console.error('Error in loading notifications');
      });
  };

  useEffect(() => {
    getNotifcations();
    const reloadData = setInterval(getNotifcations, NotificationReload);
    return () => {
      clearInterval(reloadData);
    };
  }, []);

  useEffect(() => {
    if (lastNotifications != -1)
      if (totalUnRead > lastNotifications) {
        new Audio(NotificationSound).play().catch(() => {
          console.error('Unable to play sound');
        });
      }
    setLN(totalUnRead);
  }, [notifications]);
  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: 340 }}>
          {totalUnRead > 0 && (
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  New
                </ListSubheader>
              }
            >
              {notifications
                .filter((n) => !n.read)
                .map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
            </List>
          )}

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Already Read
              </ListSubheader>
            }
          >
            {notifications
              .filter((n) => n.read)
              .map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
          </List>
        </Scrollbar>
        <Divider />
      </MenuPopover>
    </>
  );
}
