/*
	Imports
*/
import { Button, Grid } from '@material-ui/core';
import userService from 'src/services/UserService';


/*
	Main Working
*/
export default ({ user, handleEdit }) => {

	/*
		Main Design
	*/
	return (
		<>
			<Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10, justifyContent: 'flex-start' }}>

				<Grid style={{ marginRight: 20 }}>
					<Button
						variant="contained"
						style={{ marginTop: 40, padding: '0px 53.7px' }}
						size="large"
						disabled={!user.certificate}
						onClick={() => {
							userService.download2(user.certificate?.url, `${user.firstName} - Certificate`)
						}}
					>
						Download Certificate
					</Button>

				</Grid>

				<Grid style={{ marginRight: 20 }}>
					<Button
						variant="contained"
						style={{ marginTop: 40, padding: '0px 53.7px' }}
						size="large"
						disabled={!user.insurance}
						onClick={() => {
							userService.download2(user.insurance?.url, `${user.firstName} - Insurance`)
						}}
					>
						Download Insurance
					</Button>

				</Grid>
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

			</Grid>
		</>
	);
};
