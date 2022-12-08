
import { createTheme, styled } from '@material-ui/core/styles';
import Page from '../components/Page';

export const FormTheme = createTheme({
	components: {
		MuiInputLabel: {
			styleOverrides: {
				root: {
					fontSize: '1rem',
					color: 'black',
					fontWeight: 500,
					marginBottom: 10
				},
			},
		},
	},
});

export const ContentStyle = styled('div')(({ theme }) => ({
	padding: theme.spacing(3, 1)
}));

export const RootStyle = styled(Page)(({ theme }) => ({
	[theme.breakpoints.up('md')]: {
		display: 'flex',
	}
}));
