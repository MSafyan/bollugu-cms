import React from 'react';
import userService from '../../../services/UserService';

export default function Auth({ admin, coordinator, teacher, student, children, onAuth }) {
  const gotoLogin = () => {
    onAuth(false);
  };

  const loggedIn = (user) => {
    if (admin) {
      if (user.isAdmin) return onAuth(true);
    }
    if (coordinator) {
      if (user.isCoordinator) return onAuth(true);
    }

    if (teacher) {
      if (user.isTeacher) return onAuth(true);
    }

    if (student) {
      if (user.isStudent) return onAuth(true);
    }
    onAuth(false);
  };

  const moveForward = () => {
    if (admin || coordinator || teacher || student) {
      userService.getLoggedInUser().then(loggedIn).catch(gotoLogin);
      return;
    }
    loggedIn();
  };

  React.useEffect(() => {
    userService.isLoggedIn().then(moveForward).catch(gotoLogin);
  }, []);
  return <>{children}</>;
}
