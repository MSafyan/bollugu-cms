/*
	Imports
		Material UI
*/
import {
	Container
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/*
	Imports:
		Our Imports
		Components and Settings
*/
import ListPageTitle from 'src/components/misc/ListPageTitle';
import batchService from 'src/services/BatchService';
import Page from '../../components/Page';
import MadrisaDetailHeader from './headers/MadrisaDetailHeader';
import ClassesList from './tables/ClassesList';
import SectionsList from './tables/SectionsList';


/*
	Main Working
*/
export default () => {
	/*
		States, Params, Navigation, Query, Variables.
	*/
	const [batch, setBatch] = useState({});
	const { year, blocked } = batch;

	const navigate = useNavigate();

	const batchID = useParams().bid;

	/*
		Handlers, Functions
	*/
	const getData = () => {
		batchService
			.getOne(batchID)
			.then((data) => {
				setBatch(data);
			})
			.catch((err) => {
				if (err.response) if (err.response.status === 401) navigate('/logout');
				navigate('/404');
			});
	};

	/*
		Use Effect Hooks.
	*/
	useEffect(getData, []);

	/*
		Main Design.
	*/
	return (
		<Page title="Madrisa Class">
			<Container>
				<MadrisaDetailHeader />
				<br />
				<ListPageTitle>
					Batch {year || '-'}
				</ListPageTitle>
				<ClassesList ended={blocked} />
				<br />
				<br />
				<SectionsList />
			</Container>
		</Page >
	);
};
