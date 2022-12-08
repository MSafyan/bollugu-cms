/*
  Imports
*/
import { Container, Grid } from '@material-ui/core';
import { Link, Link as RouterLink } from 'react-router-dom';


import TextLogoCard from 'src/components/misc/cards/TextLogoCard';
import { AdminsIcon, CoordinatorsIcon, StudentsIcon, TeachersIcon } from 'src/config/icons';
import palette from 'src/theme/palette';
import Page from '../../components/Page';

/*
  Main Working
*/
export default () => {

  /*
    Main Design
  */
  return (
    <Page title='Dashboard'>
      <Container maxWidth="xl" style={{
        height: '100vh',
      }}>
        <Grid container spacing={1} style={{
          height: '100vh',
          alignItems: 'center'

        }} >
          <Grid item xs={12} sm={6} md={6}>
            <Link to={"./student/login"} style={{ textDecoration: 'none' }} component={RouterLink} >
              <TextLogoCard icon={StudentsIcon} color={'#fff'} backgroundColor={palette.secondary.main} title={"Student Portal"} noAmount />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Link to={"./teacher/login"} style={{ textDecoration: 'none' }} component={RouterLink} >
              <TextLogoCard icon={TeachersIcon} color={'#fff'} backgroundColor={palette.primary.main} title={"Teacher Portal"} noAmount />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Link to={"./coordinator/login"} style={{ textDecoration: 'none' }} component={RouterLink} >
              <TextLogoCard icon={CoordinatorsIcon} color={'#fff'} backgroundColor={palette.primary.main} title={"Coordinator Portal"} noAmount />
            </Link>

          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Link to={"./admin/login"} style={{ textDecoration: 'none' }} component={RouterLink} >
              <TextLogoCard icon={AdminsIcon} color={'#fff'} backgroundColor={palette.secondary.main} title={"Admin Portal"} noAmount />
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Page >
  );
};
