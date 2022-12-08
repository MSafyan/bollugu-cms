/*
	Imports
*/
import {
	Container
} from '@material-ui/core';
import Page from '../../components/Page';
import MadrisaDetailHeader from './headers/MadrisaDetailHeader';
import MadrisaBatchesList from './tables/MadrisaBatchesList';

/*
	Main Working
*/
export default () => {
	return (
		<Page title="Madrisa Profile">
			<Container>
				<MadrisaDetailHeader />
				<MadrisaBatchesList />
			</Container>
		</Page>
	);
};
