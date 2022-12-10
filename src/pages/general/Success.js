/*
  Imports
*/
import { Container, Stack, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Page from 'src/components/Page';
import { RouteProfile } from 'src/config/routes';
import userService from 'src/services/UserService';
import { ContentStyle } from 'src/theme/logo-only-pages';

/*
	Main Working
*/
export default () => {
	/*
	  States, Params, Navigation, Query, Variables.
	*/
	const navigator = useNavigate();

	/*
	  Handlers, Functions
	*/
	const completeOnBoarding = () => {
		userService.completeOnBoarding().then(() => {
			navigator(RouteProfile, { replace: true });
		});
	};

	/*
	  Use Effect Hooks.
	*/
	useEffect(completeOnBoarding, []);

	/*
	  Main Design
	*/
	return (
		<Page title="Completed On Boarding">
			<Container>
				<ContentStyle>
					<Stack sx={{ mb: 6 }}>
						<Typography variant="h4" style={{ textAlign: 'center' }} gutterBottom>
							On Boarding Success
							<br />
							Please wait while we redirect you to your profile.
						</Typography>
					</Stack>
				</ContentStyle>
			</Container>
		</Page>
	);
};
