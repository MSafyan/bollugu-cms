/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import courseService from '../../services/CourseService';
import CoursesList from './tables/CoursesList';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const madrisaID = useParams().mID;
  const pageName = madrisaID + ' Courses';

  /*
    Handlers, Functions
  */

  const getData = () => {
    setLoading(true);
    courseService
      .getInMadrisa(madrisaID, [
        'pre',
        'classes.teacher',
        'classes.students',
        'classes.batch.madrisa'
      ])
      .then((courses) => {
        let madaris = [];
        for (const course of courses) {
          let isIn = false;
          let students = 0;

          course.teachers = 0;
          const teacherArray = [];

          for (const _class of course.classes) {
            if (_class.batch.madrisa.code !== madrisaID) continue;
            isIn = true;
            students += _class.students.length;
            if (_class.teacher)
              if (!teacherArray.includes(_class.teacher.id)) {
                teacherArray.push(_class.teacher.id);
                course.teachers++;
              }
          }
          course.students = students;
          if (isIn) madaris.push(course);
        }
        setData(madaris);
      })
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/logout');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(getData, []);

  /*
    Main Design
  */
  return (
    <Page title={pageName}>
      <Container>
        <ListPageTitle>{pageName}</ListPageTitle>
        {loading ? <CenterLoading /> : <CoursesList course={data} />}
      </Container>
    </Page>
  );
};
