/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import classService from 'src/services/ClassService';
import courseContentService from 'src/services/CourseContentService';
import Page from '../../components/Page';
import CourseClassesList from './tables/CourseClassesList';
import CourseContentList from './tables/CourseContentList';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [courseContent, setCourseContent] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const courseID = useParams().courseID;
  const madrisaID = useParams().mID;
  const pageName = madrisaID + ' Course - ' + courseID;

  /*
    Handlers, Functions
  */
  const getData = async () => {
    try {
      setCourseContent(await courseContentService.findAll(courseID, 0, 400));
      const courseClasses = await classService.findByCourse(courseID, 0, 400, [
        'teacher.user',
        'students',
        'attendances.students',
        'marks.marks.student',
        'batch.madrisa'
      ]);
      setClasses(courseClasses.filter(c => c.batch.madrisa.code == madrisaID));
    } catch (error) {
      if (error.response) if (error.response.status === 401) navigate('/401');
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design.
  */
  return (
    <Page title={pageName}>
      <Container>
        <ListPageTitle>{pageName}</ListPageTitle>
        {loading ? (
          <CenterLoading />
        ) : (
          <>
            <ListPageTitle>Classes</ListPageTitle>
            <CourseClassesList classes={classes} />
            <br />
            <br />
            <br />
            <ListPageTitle>Admin's Course Content</ListPageTitle>
            <CourseContentList courseContent={courseContent} />
          </>
        )}
      </Container>
    </Page>
  );
};
