/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';



import { useContext, useEffect, useState } from 'react';
import CenterLoading from 'src/components/misc/CenterLoading';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import courseContentService from 'src/services/CourseContentService';
import Page from '../../components/Page';
import { ClassContext } from './context/ClassContext';
import ClassHeader from './header/ClassHeader';
import AdminCourseContentList from './tables/AdminCourseContentList';
import CourseContentList from './tables/CourseContentList';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const class_ = useContext(ClassContext).c;
  const reload = useContext(ClassContext).reload;
  const [courseContent, setCourseContent] = useState([]);

  /*
      Handlers, Functions
    */
  const getData = async () => {
    try {
      setLoading(true);
      setCourseContent(await courseContentService.findAll(class_.course.code, 0, 400));
    } catch (error) {
      if (error.response) if (error.response.status === 401) navigate('/401');
      navigate('/404');
      //TODO: Improve error handling here
    } finally {
      setLoading(false);
    }
  };

  /*
      Use Effect Hooks.
    */
  useEffect(getData, []);

  /*
    Handlers, Functions
  */
  const handleAdd = () => {
    navigate('./add');
  };

  const toHome = () => {
    navigate(`/teacher/${class_.name}`);
  };

  /*
    Main Design
  */
  return (
    <Page title={class_.name}>
      <Container>
        <ListPageTitleWithLink onClick={toHome}>{class_.name}</ListPageTitleWithLink>
        {loading ? (
          <CenterLoading />
        ) : (
          <>
            <ClassHeader data={class_} />
            <br />
            <br />
            <CourseContentList data={class_.contents} reload={reload} past={class_.blocked} />
            <br />
            <br />
            <AdminCourseContentList courseContent={courseContent} />
          </>
        )}
        {!class_.blocked && <FloatingAdd tooltip='Add new course content' onClick={handleAdd} />}
      </Container>
    </Page>
  );
};
