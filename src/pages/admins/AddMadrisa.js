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
import Form from './forms/AddMadrisaForm';
import Page from 'src/components/Page';
import coordinatorService from 'src/services/CoordinatorService';
import otherService from 'src/services/OtherService';

/*
	Main Working
*/
export default ({ editing }) => {
	/*
	  States, Params, Navigation, Query, Variables.
	*/
	const [coordinators, setCoordinators] = useState(null);
	const [cities, setCities] = useState(null);

	/*
	  Handlers, Functions
	*/
	function getCoordinators() {
		coordinatorService
			.getAll(0, 400)
			.then((data) => {
				setCoordinators(data);
			})
			.catch((_err) => {
				console.error('Error in getting coordinators');
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
		getCoordinators();
	}, []);

	/*
	  Main Design
	*/
	return (
		<Page title='Add Madrisa'>
			<Container maxWidth="xl">
				<Form coordinators={coordinators} cities={cities} editing={editing} />
			</Container>
		</Page>
	);
};
