/*
    Imports:
        External Libraries
*/
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
/*
    Imports:
        Material UI
*/

import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import courseService from '../../services/CourseService';
import { ClassContext } from '../teachers/context/ClassContext';
import Form from './forms/AddCourseContentForm';

/*
    Main Working
*/
export default ({ editing, teacher }) => {
  const courseID = useParams().courseID;
  const [course, setCourses] = useState(null);
  var classes = teacher ? useContext(ClassContext).c : null;

  function getCourses() {
    courseService
      .find(courseID)
      .then((data) => {
        setCourses(data);
      })
      .catch((_err) => {
        //Eerror getting coruses
      });
  }

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <Page title={`${editing ? 'Edit' : 'Add'} Course Content`} >
      <Container maxWidth="xl">
        {course && <Form course={course} editing={editing} teacher={teacher} classes={classes} />}
      </Container>
    </Page>
  );
};

