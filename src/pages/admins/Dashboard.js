/*
  Imports
*/
import { Container, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';

import CenterLoading from 'src/components/misc/CenterLoading';
import TextLogoCard from 'src/components/misc/cards/TextLogoCard';
import { CoordinatorsIcon, CoursesIcon, MadarisIcon, StudentsIcon, TeachersIcon } from 'src/config/icons';
import coordinatorService from 'src/services/CoordinatorService';
import courseService from 'src/services/CourseService';
import madrisaService from 'src/services/MadrisaService';
import studentService from 'src/services/StudentService';
import teacherService from 'src/services/TeacherService';
import palette from 'src/theme/palette';
import Page from '../../components/Page';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState(0);
  const [teachers, setTeachers] = useState(0);
  const [madaris, setMadaris] = useState(0);
  const [coordinators, setCoordinators] = useState(0);
  const [courses, setCourses] = useState(0);


  /*
    Handlers, Functions
  */
  const getData = () => {
    studentService.getCount()
      .then((total) => {
        setStudents(total);
      })
      .catch(() => {
        console.error('Error Getting Students Count');
      })
      .finally(() => setLoading(false));

    teacherService.getCount()
      .then((total) => {
        setTeachers(total);
      })
      .catch(() => {
        console.error('Error Getting Teachers Count');
      })
      .finally(() => setLoading(false));

    coordinatorService.getCount()
      .then((total) => {
        setCoordinators(total);
      })
      .catch(() => {
        console.error('Error Getting Coordinators Count');
      })
      .finally(() => setLoading(false));

    madrisaService.getCount()
      .then((total) => {
        setMadaris(total);
      })
      .catch(() => {
        console.error('Error Getting Madrisa Count');
      })
      .finally(() => setLoading(false));

    courseService.getCount()
      .then((total) => {
        setCourses(total);
      })
      .catch(() => {
        console.error('Error Getting Courses Count');
      })
      .finally(() => setLoading(false));
  };
  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design
  */
  return (
    <Page title='Dashboard'>
      {loading ? (
        <CenterLoading />
      ) : (
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <TextLogoCard icon={StudentsIcon} color={'#fff'} backgroundColor={palette.secondary.main} title={"Total Students"} amount={students} />

            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextLogoCard icon={TeachersIcon} color={'#fff'} backgroundColor={palette.primary.main} title={"Total Teachers"} amount={teachers} />

            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextLogoCard icon={CoordinatorsIcon} color={'#fff'} backgroundColor={palette.primary.main} title={"Total Coordinators"} amount={coordinators} />

            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextLogoCard icon={MadarisIcon} color={'#fff'} backgroundColor={palette.secondary.main} title={"Total Madaris"} amount={madaris} />

            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextLogoCard icon={CoursesIcon} color={'#fff'} backgroundColor={palette.secondary.main} title={"Total Courses"} amount={courses} />

            </Grid>
          </Grid>
        </Container>
      )}
    </Page>
  );
};
