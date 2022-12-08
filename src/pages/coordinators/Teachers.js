/*
	Imports
*/
import {
	Container
} from '@material-ui/core';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import { MadrisaContext } from './context/MadrisaContext';
import TeachersList from './tables/TeachersList';

/*
	Main Working
*/
export default () => {
	/*
	  States, Params, Navigation, Query, Variables.
	*/
	const navigate = useNavigate();
	const { madrisa, reload } = useContext(MadrisaContext);
	const pageName = madrisa.code + " Teachers";

	/*
	  Handlers, Functions
	*/

	const handleAdd = () => {
		navigate('./add');
	};

	const teachers = madrisa.teachers;
	for (const teacher of teachers) {
		const allCourses = [];
		teacher.classes = teacher.classes.filter((c) => c.batch.madrisa.id == madrisa.id);
		teacher.courses = 0;
		teacher.totalClasses = 0;
		for (const c of teacher.classes) {
			teacher.totalClasses++;
			if (!c.course) continue;
			if (!allCourses.includes(c.course.id)) {
				allCourses.push(c.course.id);
				teacher.courses++;
			}
		}

	}


	/*
	  Main Design
	*/
	return (
		<Page title={pageName}>
			<Container>
				<ListPageTitle>
					{pageName}
				</ListPageTitle>
				<TeachersList blocked={madrisa.blocked} teachers={teachers} getData={reload} />
				{!madrisa.blocked && <FloatingAdd tooltip='Add new teacher' onClick={handleAdd} />}
			</Container>
		</Page>
	);
};
