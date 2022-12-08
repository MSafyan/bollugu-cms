/*
  Imports
*/
import { Container, Stack, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Page from 'src/components/Page';
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
	const handleLogout = () => {
		userService.logout();
		navigator('/', { replace: true });
	};

	/*
	  Use Effect Hooks.
	*/
	useEffect(handleLogout, []);

	/*
	  Main Design
	*/
	return (
		<Page title="Logout">
			<Container>
				<ContentStyle>
					<Stack sx={{ mb: 6 }}>
						<Typography variant="h4" style={{ textAlign: 'center' }} gutterBottom>
							Signed Out
						</Typography>
					</Stack>
				</ContentStyle>
			</Container>
		</Page>
	);
};
