/*
	Imports
*/
import { Stack, Typography } from '@material-ui/core';
import LogoOnlyBody from 'src/components/misc/LogoOnlyBody';
import { ForgetPageImage } from 'src/config/settings';
import { RootStyle } from 'src/theme/logo-only-pages';
import palette from 'src/theme/palette';
import ForgetPasswordForm from './forms/ForgetPasswordForm';

/*
	Main Working
*/
export default () => {
	return (
		<RootStyle title="Forget Password">
			<LogoOnlyBody image={ForgetPageImage}>
				<Stack sx={{ mb: 9 }}>
					<Typography variant="h4" gutterBottom>
						Forget Password
					</Typography>
					<Typography sx={{ color: palette.text.secondary }}>Enter Your Email Below.</Typography>

					<br />
					<br />

					<ForgetPasswordForm />
				</Stack>
			</LogoOnlyBody>
		</RootStyle>
	);
};
