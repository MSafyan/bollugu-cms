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
import CoursesList from './tables/CoursesList';

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
		<Page title="Courses">
			<Container>
				<ListPageTitle>
					Courses
				</ListPageTitle>
				<CoursesList />
				<FloatingAdd tooltip='Add new course' onClick={handleAddButton} />
			</Container>
		</Page>
	);
};
