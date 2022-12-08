/*
  Imports
*/
import { Stack, Typography } from '@material-ui/core';
import LogoOnlyBody from 'src/components/misc/LogoOnlyBody';
import {
  AdminLoginImage,
  CoordinatorLoginImage,
  StudentLoginImage,
  TeacherLoginImage
} from 'src/config/settings';
import { RootStyle } from 'src/theme/logo-only-pages';
import palette from 'src/theme/palette';
import LoginForm from './forms/LoginForm';

/*
  Main Working
*/
export default ({ admin, coordinator, teacher, student }) => {
  let loginDisplay = 'Admin';
  let image = AdminLoginImage;
  if (coordinator) {
    loginDisplay = 'Coordinator';
    image = CoordinatorLoginImage;
  }

  if (teacher) {
    loginDisplay = 'Teacher';
    image = TeacherLoginImage;
  }

  if (student) {
    loginDisplay = 'Student';
    image = StudentLoginImage;
  }

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
        <LoginForm admin={admin} coordinator={coordinator} teacher={teacher} student={student} />
      </LogoOnlyBody>
    </RootStyle>
  );
};
