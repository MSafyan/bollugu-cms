/*
  Imports
*/
import { Container, Grid } from '@material-ui/core';
import { Link, Link as RouterLink } from 'react-router-dom';

import Cards from 'src/components/misc/cards/Cards';
import {
  ClassesIcon,
  CoursesIcon,
  StudentSearchIcon,
  StudentsIcon,
  TeachersIcon
} from 'src/config/icons';
import palette from 'src/theme/palette';

/*
  Main Working
*/
export default () => {

  /*
    Main Design
  */
  return (
    <Container style={{ marginTop: '70px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Link to={'./teachers'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={TeachersIcon}
              color={'#fff'}
              backgroundColor={palette.primary.main}
              title={'Teachers'}
              noAmount
            />
          </Link>
        </Grid>
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
          <Link to={'./classes'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={ClassesIcon}
              color={'#fff'}
              backgroundColor={palette.primary.main}
              title={'Classes'}
              noAmount
            />
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Link to={'./search'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={StudentSearchIcon}
              color={'#fff'}
              backgroundColor={palette.secondary.main}
              title={'Student Search'}
              noAmount
            />
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Link to={'./courses'} style={{ textDecoration: 'none' }} component={RouterLink}>
            <Cards
              icon={CoursesIcon}
              color={'#fff'}
              backgroundColor={palette.primary.main}
              title={'Courses'}
              noAmount
            />
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};
