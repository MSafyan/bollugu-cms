/*
	Imports
*/
import { Stack, Typography } from '@material-ui/core';
import LogoOnlyBody from 'src/components/misc/LogoOnlyBody';
import { ForgetPageImage } from 'src/config/settings';
import { RootStyle } from 'src/theme/logo-only-pages';
import palette from 'src/theme/palette';
import ResetPasswordForm from './forms/ResetPasswordForm';

/*
	Main Working
*/
export default () => {
	return (
		<RootStyle title="Reset Password">
			<LogoOnlyBody image={ForgetPageImage}>
				<Stack sx={{ mb: 9 }}>
					<Typography variant="h4" gutterBottom>
						Reset Password
					</Typography>
					<Typography sx={{ color: palette.text.secondary }}>Enter Your New Password Below.</Typography>

					<br />
					<br />

					<ResetPasswordForm />
				</Stack>
			</LogoOnlyBody>
		</RootStyle>
	);
};
