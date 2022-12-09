/*
  Imports
*/
import { Stack, Typography } from '@material-ui/core';
import LogoOnlyBody from 'src/components/misc/LogoOnlyBody';
import {
  LoginImage,
} from 'src/config/settings';
import { RootStyle } from 'src/theme/logo-only-pages';
import palette from 'src/theme/palette';
import LoginForm from './forms/LoginForm';

/*
  Main Working
*/
export default ({ }) => {
  let loginDisplay = 'Chef';
  let image = LoginImage;


  return (
    <RootStyle title={loginDisplay}>
      <LogoOnlyBody image={image}>
        <Stack sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            {loginDisplay} Login
          </Typography>
          <Typography sx={{ color: palette.text.secondary }}>
            Enter Your Login Details Below.
          </Typography>
        </Stack>
        <LoginForm />
      </LogoOnlyBody>
    </RootStyle>
  );
};
