/*
	Imports
	Material UI
*/
import {
	Container
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import CoordinatorsList from './tables/CoordinatorsList';

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
		<Page title="Coordinators">
			<Container>
				<ListPageTitle>
					Coordinators
				</ListPageTitle>
				<CoordinatorsList />
				<FloatingAdd tooltip='Add new coordinator' onClick={handleAddButton} />
			</Container>
		</Page>
	);
};
