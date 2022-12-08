/*
	Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import MadarisList from './tables/MadarisList';

/*
	Main Working
*/
export default () => {
	/*
	  States, Params, Navigation, Query, Variables.
	*/
	const navigate = useNavigate();

	/*
	  Handlers, Functions
	*/
	const handleAddButton = () => {
		navigate('./add');
	};

	/*
	  Main Design
	*/
	return (
		<Page title="Madaris">
			<Container>
				<ListPageTitle>
					Madaris
				</ListPageTitle>
				<MadarisList />
				<FloatingAdd tooltip='Add new madrisa' onClick={handleAddButton} />
			</Container>
		</Page>
	);
};
