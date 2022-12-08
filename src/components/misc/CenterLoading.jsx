import { CircularProgress } from "@material-ui/core";

const style = {
	height: '100%',
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

export default () => {
	return (
		<div style={style}>
			<CircularProgress color="primary" />
		</div>
	);
};