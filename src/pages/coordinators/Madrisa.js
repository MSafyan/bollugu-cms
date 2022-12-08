/*
	Imports
*/
import {
	Container
} from '@material-ui/core';
import { useContext } from 'react';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import MadrisaCards from './body/MadrisaCards';
import { MadrisaContext } from './context/MadrisaContext';
import MadrisaHeader from './header/MadrisaHeader';

/*
	Main Working
*/
export default () => {
	/*
	  States, Params, Navigation, Query, Variables.
	*/
	const { madrisa } = useContext(MadrisaContext);

	return (
		<Page title={madrisa.name}>
			<Container>
				<ListPageTitle>
					{madrisa.name}
				</ListPageTitle>

				<MadrisaHeader madrisa={madrisa} />
				<MadrisaCards />
			</Container>
		</Page>
	);
};
