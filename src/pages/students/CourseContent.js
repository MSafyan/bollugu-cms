/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';



import { useContext, useEffect, useState } from 'react';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import courseContentService from 'src/services/CourseContentService';
import Page from '../../components/Page';
import { StudentClassContext } from './context/StudentClassContext';
import ClassHeader from './header/ClassHeader';
import CourseContentList from './tables/CourseContentList';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const class_ = useContext(StudentClassContext).c;
  const [courseContent, setCourseContent] = useState([]);

  /*
      Handlers, Functions
    */
  const getData = async () => {
    try {
      setLoading(true);
      setCourseContent([...(await courseContentService.findAll(class_.course.code, 0, 400)), ...class_.contents]);
    } catch (error) {
      if (error.response?.status === 401) navigate('/401');
    } finally {
      setLoading(false);
    }
  };

  const toHome = () => {
    navigate(`/student/${class_.name}`);
  };

  /*
      Use Effect Hooks.
    */
  useEffect(getData, []);

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
            <CourseContentList data={courseContent} />
          </>
        )}
      </Container>
    </Page>
  );
};
