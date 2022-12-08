/*
	Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import CourseContentList from '../admins/tables/CourseContentList';
import CourseContentHeader from './headers/CourseContentHeader';

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
		<Page title="Course Content">
			<Container>
				<CourseContentHeader />
				<ListPageTitle>
					Course Content
				</ListPageTitle>

				<CourseContentList />

				<FloatingAdd tooltip='Add new couse content' onClick={handleAddButton} />
			</Container>
		</Page>
	);
};
