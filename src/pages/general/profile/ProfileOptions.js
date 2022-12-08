/*
	Imports
*/
import { Button, Grid } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';


/*
	Main Working
*/
export default ({ user, handleDelete, handleEdit, handleLock }) => {
	/*
	  States, Params, Navigation, Query, Variables.
	*/
	const { blocked } = user;

	/*
		Main Design
	*/
	return (
		<>
			<Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10, justifyContent: 'flex-start' }}>
				<Grid style={{ marginRight: 20 }}>
					{
						handleEdit && <Button
							variant="contained"
							style={{ marginTop: 40, padding: '0px 53.7px' }}
							size="large"
							onClick={handleEdit}
						>
							Edit
						</Button>
					}
				</Grid>
				{
					handleDelete &&
					<Grid style={{ marginRight: 20 }}>
						<Button
							variant="contained"
							onClick={handleDelete}
							component={RouterLink}
							to="#"
							style={{ marginTop: 40, padding: '0px 45px' }}
							size="large"
						>
							Delete
						</Button>
					</Grid>
				}
				<Grid style={{ marginRight: 20 }}>
					{
						handleLock && <Button
							variant="contained"
							component={RouterLink}
							to="#"
							style={{ marginTop: 40, padding: '0px 51.5px' }}
							size="large"
							onClick={handleLock}
						>
							{blocked ? `Unlock` : `Lock`}
						</Button>
					}
				</Grid>
			</Grid>
		</>
	);
};
