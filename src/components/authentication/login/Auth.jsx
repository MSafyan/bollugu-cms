import React from 'react';
import userService from '../../../services/UserService';

export default function Auth({ onAuth, children }) {
  const gotoLogin = () => {
    onAuth(false);
  };

  const loggedIn = () => {
    onAuth(true);
  };

  const moveForward = () => {
    loggedIn();
  };

  React.useEffect(() => {
    userService.isLoggedIn().then(moveForward).catch(gotoLogin);
  }, []);
  return <>{children}</>;
}
