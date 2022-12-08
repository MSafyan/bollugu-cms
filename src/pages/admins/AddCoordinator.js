/*
	Imports
*/
import { useEffect, useState } from 'react';
/*
	Imports:
		Material UI
*/

import { Container } from '@material-ui/core';
/*
	Imports:
		Our Imports
		Components and Settings
*/
import Form from './forms/AddCoordinatorForm';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from 'src/components/Page';
import madrisaService from '../../services/MadrisaService';
import otherService from '../../services/OtherService';
import CenterLoading from 'src/components/misc/CenterLoading';

/*
	Main Working
*/
export default ({ editing }) => {
	/*
	  States, Params, Navigation, Query, Variables.
	*/
	const [madaris, setMadaris] = useState(null);
	const [cities, setCities] = useState(null);

	/*
	  Handlers, Functions
	*/

	function getMadaris() {
		madrisaService
			.getAll(0, 400)
			.then((data) => {
				setMadaris(data);
			})
			.catch(() => {
				console.error('Error in getting madaris list');
			});
	}

	function getCities() {
		otherService
			.getCities(0, 400)
			.then((data) => {
				setCities(data);
			})
			.catch((_err) => {
				console.error('Error in getting cities');
			});
	}

	/*
	  Use Effect Hooks.
	*/
	useEffect(() => {
		getCities();
		getMadaris();
	}, []);

	/*
	  Main Design
	*/
	return (
		<Page title={`${editing ? 'Edit' : 'Add'} Coordinator`} >
			<Container maxWidth="xl">
				{
					!cities || !madaris ?
						<CenterLoading />
						:
						<>
							<ListPageTitle>
								{editing ? 'Edit' : 'Add'} Coodinator
							</ListPageTitle>
							<Form madaris={madaris} cities={cities} editing={editing} />
						</>
				}
			</Container>
		</Page >
	);
};
