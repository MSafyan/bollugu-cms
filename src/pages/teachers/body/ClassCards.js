/*
  Imports
*/
import { Container, Grid } from '@material-ui/core';
import { Link, Link as RouterLink } from 'react-router-dom';

import {
  AnnouncementIcon,
  AssignmentIcon,
  AttendanceIcon,
  CoursesIcon,
  GradeIcon,
  MarksIcon,
  StudentsIcon
} from 'src/config/icons';
import palette from 'src/theme/palette';
import Cards from '../../../components/misc/cards/Cards';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */

  /*
    Main Design
  */
  return (
    <Container style={{ marginTop: '70px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Link to={'./students'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={StudentsIcon}
              color={'#fff'}
              backgroundColor={palette.secondary.main}
              title={'Students'}
              noAmount
            />
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Link to={'./attendance'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={AttendanceIcon}
              color={'#fff'}
              backgroundColor={palette.primary.main}
              title={'Attendance'}
              noAmount
            />
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Link to={'./marks'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={MarksIcon}
              color={'#fff'}
              backgroundColor={palette.secondary.main}
              title={'Marks'}
              noAmount
            />
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Link to={'./course-contents'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={CoursesIcon}
              color={'#fff'}
              backgroundColor={palette.primary.main}
              title={'Course Content'}
              noAmount
            />
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Link to={'./assignments'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={AssignmentIcon}
              color={'#fff'}
              backgroundColor={palette.secondary.main}
              title={'Assignment'}
              noAmount
            />
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Link to={'./announcements'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={AnnouncementIcon}
              color={'#fff'}
              backgroundColor={palette.primary.main}
              title={'Announcement'}
              noAmount
            />
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Link to={'./gradingsystem'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={GradeIcon}
              color={'#fff'}
              backgroundColor={palette.secondary.main}
              title={'Grading System'}
              noAmount
            />
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};
