/*
	Imports
*/
import { Grid, Typography } from '@material-ui/core';


/*
	Main Working
*/
export default ({ user }) => {
	/*
	  States, Params, Navigation, Query, Variables.
	*/
	const { qualification, experience, madrisa } = user;

	/*
		Main Design
	*/
	return (
		<>
			<Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10 }}>
				<Grid item xs={12} sm={2} md={2}>
					<Typography fontWeight="bold">Qualification: </Typography>
				</Grid>
				<Grid item xs={12} sm={4} md={4}>
					<Typography>{qualification}</Typography>
				</Grid>

				<Grid item xs={12} sm={2} md={2}>
					<Typography fontWeight="bold">Experience: </Typography>
				</Grid>
				<Grid item xs={12} sm={4} md={4}>
					<Typography>{experience}</Typography>
				</Grid>

			</Grid>
			<Grid container spacing={0} style={{ paddingBottom: 10, paddingTop: 10 }}>
				<Grid item xs={12} sm={2} md={2}>
					<Typography fontWeight="bold">Madaris: </Typography>
				</Grid>
				<Grid item xs={12} sm={4} md={4}>
					<Typography>{madrisa}</Typography>
				</Grid>
			</Grid>
		</>
	);
};
