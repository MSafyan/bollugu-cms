import React from 'react';
import userService from '../../../services/UserService';

export default function Auth({ admin, onAuth, children }) {
  const gotoLogin = () => {
    onAuth(false);
  };

  const loggedIn = (user) => {
    if (admin) {
      if (user.isAdmin) return onAuth(true);
    }

    onAuth(false);
  };

  const moveForward = () => {
    if (admin) {
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
